---
title: ChatModel和ChatClient
from: '/posts/saa-chatModel-and-chatClient'
cover: https://yuumii.top/article/20260716_LearningSpringAI/1784791739901-6a86d7f7-e607-4022-b91b-f0099ee78274.png
categories: SpringAI Alibaba
tags:
  - SpringAI Alibaba
  - 学习笔记
date: 2026-08-26
description:
---


#ChatModel和ChatClient
学习SAA(SpringAI Alibaba)过程中搞混了ChatModel和ChatClient，现在记录一下
![](https://yuumii.top/article/20260826_SAA_ChatModelAndChatClient/1787716228709-2382e382-6ec1-46a6-aa79-61cbbe85f12b.png)
详情的区别看一下上面图片 下面分开讲一讲
### ChatModel 的注入方式
在注入形式上 ChatClient是一个Interface，不能像ChatModel一样使用@Resources自动注入到Spring中
先看一下ChatModel的注入方式
```java 
    @Resource
    private ChatModel dashScopeChatModel;

//    ChatClient只能支持手动注入，不支持像下面这样的自动注入
//    @Resource
//    private ChatClient chatClient;

    @GetMapping(value = "/chatModel/doChat")
    public String doChat(@RequestParam(name = "msg",defaultValue = "你是谁")String msg){
        return dashScopeChatModel.call(msg);
    }
```

### ChatClient的注入方式
ChatClient的注入方式有两种 ，一种是通过全局注入，另外一种是通过单个Controller构造器去注入，但是这样的注入方式也是只能用在单一Controller里面。我们两种都看一下，
****全局注入****
写一个配置类Config，然后通过ChatClient的Builder去注入到一个ChatClient类里面，然后使用@Bean注入到Spring里面全局使用
```java

@Configuration
public class SaaLLMConfig {

    /**
     * 知识出处：
     * https://java2ai.com/docs/1.0.0.2/tutorials/basics/chat-client/?spm=5176.29160081.0.0.2856aa5cmUTyXC#%E5%88%9B%E5%BB%BA-chatclient
     
     * @param dashscopeChatModel
     * @return
     */
    @Bean
    public ChatClient chatClient(ChatModel dashscopeChatModel)
    {
        return ChatClient.builder(dashscopeChatModel).build();
    }

}


***********************************************************
//下面是Controller 使用到刚刚的全局注入



@RestController
public class ChatClientControllerV2
{
    /**
     * chatModel + ChatClient 混合使用
     */
    @Resource
    private ChatModel chatModel;

    @Resource
    private ChatClient dashScopechatClientv2;

    /**
     * http://localhost:8003/chatclientv2/dochat
     * @param msg
     * @return
     */
    @GetMapping("/chatclientv2/dochat")
    public String doChat(@RequestParam(name = "msg",defaultValue = "你是谁") String msg)
    {
        String result = dashScopechatClientv2.prompt().user(msg).call().content();
        System.out.println("ChatClient响应：" + result);
        return result;
    }

    /**
     * http://localhost:8003/chatmodelv2/dochat
     * @param msg
     * @return
     */
    @GetMapping("/chatmodelv2/dochat")
    public String doChat2(@RequestParam(name = "msg",defaultValue = "你是谁") String msg)
    {
        String result = chatModel.call(msg);
        System.out.println("ChatModel响应：" + result);
        return result;
    }
}

```

****单一注入****

单一注入是在Controller的构造器里面去注入一个Client，其实过程还是一样，但是这样的注入方式只可以在单一Controller里面访问
```java 
package com.atguigu.study.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @auther zzyybs@126.com
 * @create 2025-07-23 19:22
 * 知识出处：
 * https://java2ai.com/docs/1.0.0.2/tutorials/basics/chat-client/?spm=5176.29160081.0.0.2856aa5cmUTyXC#%E5%88%9B%E5%BB%BA-chatclient
 */
@RestController
public class ChatClientController
{
    private final ChatClient dashScopechatClient;

    /**
     * 使用自动配置的 ChatClient.Builder
     * @param dashscopeChatModel
     */
    public ChatClientController(ChatModel dashscopeChatModel)
    {
        this.dashScopechatClient = ChatClient.builder(dashscopeChatModel).build();
    }

    /**
     * http://localhost:8003/chatclient/dochat
     * @param msg
     * @return
     */
    @GetMapping("/chatclient/dochat")
    public String doChat(@RequestParam(name = "msg",defaultValue = "2加4等于几") String msg)
    {
        String result = dashScopechatClient.prompt().user(msg).call().content();
        System.out.println("响应：" + result);
        return result;
    }
}


```

### 调用方式和输出 

ChatModel是使用call或者Stream 但是需要手动解析响应的文本 我们是使用String或者Flux<String>来接收的然后返回 
   
``` java
@RestController
public class ChatHelloController {

    @Resource
    private ChatModel chatModel;

    @GetMapping(value = "/callHello")
    public String doChat(@RequestParam(name = "msg",defaultValue = "你是谁") String msg){
        return chatModel.call(msg);
    }

    @GetMapping(value = "/streamHello")
    public Flux<String> doStream(@RequestParam(name = "msg",defaultValue = "你是谁") String msg){
        return chatModel.stream(msg);
    }

}
  
```
  ChatClient是链式调用，并且自动封装提示词和解析响应
``` java
    /**
     * http://localhost:8003/chatclient/dochat
     * @param msg
     * @return
     */
    @GetMapping("/chatclient/dochat")
    public String doChat(@RequestParam(name = "msg",defaultValue = "2加4等于几") String msg)
    {
        String result = dashScopechatClient.prompt().user(msg).call().content();
        System.out.println("响应：" + result);
        return result;
    }
  ```
现在可能还是有点看不出来到底****封装****的好处体现在哪，那是因为我们现在使用的还是最简单的一问一答，如果你需要更复杂的提示词，比如加 **System 系统角色提示词**，ChatModel 原生就必须你手动写一堆对象：
``` java 
  
  // ChatModel：要system提示，必须手动new Message、手动new Prompt
List<Message> messages = List.of(
        new SystemMessage("你是一个Java讲师，回答简短"),
        new UserMessage(msg)
);
Prompt prompt = new Prompt(messages);

ChatResponse response = chatModel.call(prompt);
// 手动解析拿文本
String content = response.getResult().getOutput().getText();
  
  
####################################################
  
  //或者是流式的也需要手动处理
  Flux<ChatResponse> flux = chatModel.stream(prompt);
// 需要自己map，把每一块流数据提取文本
Flux<String> stringFlux = flux.map(resp -> resp.getResult().getOutput().getText());


  ```
  
 但是像比如ChatClient，封装的好处就体现出来了
  他只需要
  ```java 
  
  String result = dashScopechatClient.prompt()
        .system("你是Java讲师，回答简短")  // 直接链式设置system提示词
        .user(msg)                       // 直接给用户消息
        .call()
        .content();                      // 直接拿字符串，不用手动getResult().getOutput().getText()
  
  ```
  
  在解析的时候，也不需要一层层去拿
  
  ```java 
  // ChatModel原生你要写这么长：
String content = response.getResult().getOutput().getText();

// ChatClient直接给你提取好字符串，屏蔽底层对象层级
String content =  ChatClient .content()
  
  
  //对于流式的也是ChatModel 的`.stream()`返回是`Flux<ChatResponse>`；
 //ChatClient 的`.stream().content()`直接输出`Flux<String>`
 // 所以我们只需要
  Flux<String> flux = chatClient.prompt()
        .user(msg)
        .stream()
        .content(); // 直接返回Flux<String>，不用自己map处理ChatResponse


  ```
  但是在这里面 网络请求依旧是 ChatModel 去完成，ChatClient 只是做参数组装、结果解析的包装。 也就是说东西还是ChatModel去干，这点在创建ChatClient的Build的时候其实就可以看出来了，还是需要放一个ChatModel进去，所以ChatClient是让我们在后续的开发中更便捷。
  ChatClient其实也可以看成是ChatModel的子类，子类嘛，都是要比父类好用一点的嘛，但是又依赖于父类，哈哈哈
 