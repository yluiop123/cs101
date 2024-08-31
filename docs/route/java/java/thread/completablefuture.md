# Java CompletableFuture 教程与示例

Java 8 引入了许多新特性和增强，比如Lambda表达式、Streams、CompletableFuture等。在本文中，我将通过简单的示例为您详细解释CompletableFuture及其所有方法。

## 什么是CompletableFuture？
CompletableFuture 用于 Java 中的异步编程。异步编程是一种通过在主应用程序线程之外的单独线程上运行任务，并通知主线程其进展、完成或失败的方式来编写非阻塞代码的手段。

这样，您的主线程不会阻塞/等待任务的完成，并且可以并行执行其他任务。

拥有这种并行性大大改善了程序的性能。

**另请参阅：** Java 并发和多线程基础

## Future 与 CompletableFuture
CompletableFuture 是 Java 5 中引入的 Java 的 Future API 的扩展。

Future 用作异步计算结果的引用。它提供了一个 `isDone()` 方法来检查计算是否完成，以及一个 `get()` 方法在计算完成时检索计算结果。

您可以从我的 Callable 和 Future 教程中了解更多关于 Future 的信息。

Future API 是 Java 中异步编程的一个好步骤，但它缺少一些重要且有用的功能 

### Future 的限制
1. **它不能手动完成：**
   假设您写了一个函数来从远程 API 获取电子商务产品的最新价格。由于这个 API 调用耗时，您在单独的线程中运行它，并从您的函数返回一个 Future。

   现在，假设如果远程 API 服务关闭了，那么您想通过产品的最后缓存价格手动完成 Future。

   您可以用 Future 做到这一点吗？不行！

2. **您不能在 Future 的结果上执行进一步操作而不阻塞：**
   Future 不会通知您它的完成。它提供了一个 `get()` 方法，该方法在结果可用之前会**阻塞**。

   您没有能力附加一个回调函数到 Future，并在 Future 的结果可用时自动调用它。

3. **多个 Futures 不能链接在一起：**
   有时您需要执行一个长时间运行的计算，当计算完成时，您需要将其结果发送到另一个长时间运行的计算，依此类推。

   您不能用 Futures 创建这样的异步工作流程。

4. **您不能组合多个 Futures：**
   假设您有 10 个不同的 Futures，您想并行运行它们，然后在它们全部完成后运行某个函数。用 Future 也无法做到。

5. **没有异常处理：**
   Future API 没有任何异常处理结构。

哇！这么多限制，对吧？嗯，这就是我们有 CompletableFuture 的原因。您可以用 CompletableFuture 实现上述所有功能。

CompletableFuture 实现了 `Future` 和 `CompletionStage` 接口，并提供了一组大量的便利方法用于创建、链接和组合多个 Futures。它还有非常全面的异常处理支持。

## 创建一个 CompletableFuture

### 1. 简单示例
您可以简单地使用以下无参数构造函数创建一个 CompletableFuture 

```java
CompletableFuture<String> completableFuture = new CompletableFuture<String>();
```

这是您可以拥有的最简单的 CompletableFuture。所有想要获取这个 CompletableFuture 结果的客户端都可以调用 `CompletableFuture.get()` 方法 

```java
String result = completableFuture.get()
```

`get()` 方法会阻塞，直到 Future 完成。因此，上面的调用将永远阻塞，因为 Future 从未完成。

您可以使用 `CompletableFuture.complete()` 方法手动完成一个 Future 

```java
completableFuture.complete("Future's Result")
```

所有等待此 Future 的客户端将获得指定的结果。并且，随后对 `completableFuture.complete()` 的调用将被忽略。

### 2. 使用 `runAsync()` 运行异步计算

如果你想异步运行一些后台任务并且不想从任务中返回任何内容，那么你可以使用 `CompletableFuture.runAsync()` 方法。它接受一个 Runnable 对象并返回 `CompletableFuture<Void>`。

```java
// 异步运行由 Runnable 对象指定的任务。
CompletableFuture<Void> future = CompletableFuture.runAsync(new Runnable() {
    @Override
    public void run() {
        // 模拟一个长时间运行的工作
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        }
        System.out.println("我将在主线程之外的单独线程中运行。");
    }
});

// 阻塞并等待 future 完成
future.get();
```

你也可以使用 Lambda 表达式传递 Runnable 对象 

```java
// 使用 Lambda 表达式
CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
    // 模拟一个长时间运行的工作
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        throw new IllegalStateException(e);
    }
    System.out.println("我将在主线程之外的单独线程中运行。");
});
```

在本文中，我将非常频繁地使用 Lambda 表达式，如果你的 Java 代码中还没有使用它，你也应该使用它。

### 3. 使用 `supplyAsync()` 异步运行任务并返回结果 

`CompletableFuture.runAsync()` 对于不返回任何内容的任务很有用。但是，如果你想从后台任务中返回一些结果怎么办？

好的，`CompletableFuture.supplyAsync()` 帮你解决。它接受一个 `Supplier<T>` 并返回 `CompletableFuture<T>`，其中 T 是通过调用给定供应商获得的值的类型

```java
// 异步运行由 Supplier 对象指定的任务
CompletableFuture<String> future = CompletableFuture.supplyAsync(new Supplier<String>() {
    @Override
    public String get() {
        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            throw new IllegalStateException(e);
        }
        return "异步计算的结果";
    }
});

// 阻塞并获取 Future 的结果
String result = future.get();
System.out.println(result);
```

`Supplier<T>` 是一个简单的函数式接口，代表结果的供应商。它有一个单独的 `get()` 方法，你可以在其中编写后台任务并返回结果。

再次，你可以使用 Java 8 的 Lambda 表达式使上述代码更加简洁 -

```java
// 使用 Lambda 表达式
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        throw new IllegalStateException(e);
    }
    return "异步计算的结果";
});
```

> **关于 Executor 和线程池的注意事项：**

> 你可能想知道 - 嗯，我知道 `runAsync()` 和 `supplyAsync()` 方法在单独的线程中执行它们的任务。但是，我们从未创建过线程，对吧？

> 是的！CompletableFuture 在从全局 ForkJoinPool.commonPool() 获取的线程中执行这些任务。

> 但是，嘿，你也可以创建一个线程池，并将其实例传递给 `runAsync()` 和 `supplyAsync()` 方法，让它们从你的线程池中获取的线程执行它们的任务。

> CompletableFuture API 中的所有方法有两种变体 - 一个接受 Executor 作为参数，一个不接受 -

```java
 // runAsync() 和 supplyAsync() 方法的变体
 static CompletableFuture<Void> runAsync(Runnable runnable)
 static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)
 static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
 static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

以下是你如何创建一个线程池并将其传递给这些方法之一的方式 -

```java
 Executor executor = Executors.newFixedThreadPool(10);
 CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
     try {
         TimeUnit.SECONDS.sleep(1);
     } catch (InterruptedException e) {
         throw new IllegalStateException(e);
     }
     return "异步计算的结果";
 }, executor);
``` 

## 转换和对 CompletableFuture 进行操作

`CompletableFuture.get()` 方法是阻塞的。它等待 Future 完成并在完成后返回结果。

但我们不是想要这样的，对吧？在构建异步系统时，我们应该能够向 CompletableFuture 附加一个回调，当 Future 完成时它应该自动被调用。

这样，我们不需要等待结果，我们可以在回调函数内编写需要在 Future 完成后执行的逻辑。

您可以使用 `thenApply()`、`thenAccept()` 和 `thenRun()` 方法向 CompletableFuture 附加回调 

 ### 1. thenApply()

您可以使用 `thenApply()` 方法在 CompletableFuture 的结果到达时处理和转换结果。它接受一个 `Function<T,R>` 作为参数。`Function<T,R>` 是一个简单的函数式接口，表示一个接受类型 T 的参数并产生类型 R 的结果的函数 -

```java
// 创建一个 CompletableFuture
CompletableFuture<String> whatsYourNameFuture = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        throw new IllegalStateException(e);
    }
    return "Rajeev";
});

// 使用 thenApply() 向 Future 附加一个回调
CompletableFuture<String> greetingFuture = whatsYourNameFuture.thenApply(name -> {
    return "Hello " + name;
});

// 阻塞并获取 future 的结果。
System.out.println(greetingFuture.get()); // Hello Rajeev
```

您也可以通过附加一系列 `thenApply()` 回调方法来编写 CompletableFuture 的 **转换序列**。一个 `thenApply()` 方法的结果是传递给下一个 -

```java
CompletableFuture<String> welcomeText = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        throw new IllegalStateException(e);
    }
    return "Rajeev";
}).thenApply(name -> {
    return "Hello " + name;
}).thenApply(greeting -> {
    return greeting + ", Welcome to the CalliCoder Blog";
});

System.out.println(welcomeText.get());
// 打印 - Hello Rajeev, Welcome to the CalliCoder Blog
```

### 2. thenAccept() 和 thenRun()

如果您不想从回调函数中返回任何内容，只想在 Future 完成后运行一些代码，那么您可以使用 `thenAccept()` 和 `thenRun()` 方法。这些方法是消费者，通常用作回调链中的最后一个回调。

`CompletableFuture.thenAccept()` 接受一个 `Consumer<T>` 并返回 `CompletableFuture<Void>`。它可以访问附加的 CompletableFuture 的结果。

```java
// thenAccept() 示例
CompletableFuture.supplyAsync(() -> {
    return ProductService.getProductDetail(productId);
}).thenAccept(product -> {
    System.out.println("从远程服务获取产品详情 " + product.getName())
});
```

虽然 `thenAccept()` 可以访问附加的 CompletableFuture 的结果，但 `thenRun()` 甚至没有访问 Future 结果的权限。它接受一个 `Runnable` 并返回 `CompletableFuture<Void>` 

```java
// thenRun() 示例
CompletableFuture.supplyAsync(() -> {
    // 运行一些计算
}).thenRun(() -> {
    // 计算完成。
});
```

> **关于异步回调方法的注意事项：**
> 
> 
> 所有由 CompletableFuture 提供的回调方法都有两个异步变体 -

```java
// thenApply() 变体
<U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn)
<U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn)
<U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn, Executor executor)
```

这些异步回调变体通过在单独的线程中执行回调任务，帮助您进一步并行化计算。

考虑以下示例 -

```java
CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        throw new IllegalStateException(e);
    }
    return "Some Result"
}).thenApply(result -> {
    /*
      在 supplyAsync() 任务执行的同一线程中执行
      或者如果 supplyAsync() 任务立即完成，则在主线程中执行（移除 sleep() 调用以验证）
    */
    return "Processed Result"
})
```

在上述情况下，`thenApply()` 内的的任务将在 `supplyAsync()` 任务执行的同一线程中执行，或者如果 `supplyAsync()` 任务立即完成，则在主线程中执行（尝试移除 `sleep()` 调用以验证）。

要对执行回调任务的线程有更多的控制，您可以使用异步回调。如果您使用 `thenApplyAsync()` 回调，那么它将在从 `ForkJoinPool.commonPool()` 获取的不同线程中执行 -

```java
CompletableFuture.supplyAsync(() -> {
    return "Some Result"
}).thenApplyAsync(result -> {
    // 在 ForkJoinPool.commonPool() 的不同线程中执行
    return "Processed Result"
})
```

此外，如果您向 `thenApplyAsync()` 回调传递一个 Executor，那么任务将在 Executor 的线程池中获取的线程中执行。

```java
Executor executor = Executors.newFixedThreadPool(2);
CompletableFuture.supplyAsync(() -> {
    return "Some result"
}).thenApplyAsync(result -> {
    // 在从执行器获取的线程中执行
    return "Processed Result"
}, executor);
```

## 组合两个 CompletableFuture

### 1. 使用 thenCompose() 结合两个依赖的 futures 

假设您想从一个远程 API 服务中获取用户详细信息，一旦用户详细信息可用，您想从另一个服务获取他的信用评级。

考虑以下 `getUserDetail()` 和 `getCreditRating()` 方法的实现 

```java
CompletableFuture<User> getUserDetail(String userId) {
    return CompletableFuture.supplyAsync(() -> {
        return UserService.getUserDetails(userId);
    });
}

CompletableFuture<Double> getCreditRating(User user) {
    return CompletableFuture.supplyAsync(() -> {
        return CreditRatingService.getCreditRating(user);
    });
}
```

现在，让我们理解如果我们使用 `thenApply()` 来实现期望的结果会发生什么 -

```java
CompletableFuture<CompletableFuture<Double>> result = getUserDetail(userId)
    .thenApply(user -> getCreditRating(user));
```

在早期示例中，传递给 `thenApply()` 回调的 `Supplier` 函数将返回一个简单值，但在这个例子中，它返回了一个 CompletableFuture。因此，上述情况中的最终结果是一个嵌套的 CompletableFuture。

如果您希望最终结果是一个顶级 Future，请改用 `thenCompose()` 方法 -

```java
CompletableFuture<Double> result = getUserDetail(userId)
    .thenCompose(user -> getCreditRating(user));
```

所以，这里的经验法则 - 如果您的回调函数返回一个 CompletableFuture，并且您希望从 CompletableFuture 链中获得一个展平的结果（在大多数情况下您会这样），那么使用 `thenCompose()`。

### 2. 使用 thenCombine() 结合两个独立的 futures -

`thenCompose()` 用于结合两个 Future，其中一个 Future 依赖于另一个，而 `thenCombine()` 用于当您希望两个 Future 独立运行并在两者都完成后执行某些操作。

```java
System.out.println("检索体重。");
CompletableFuture<Double> weightInKgFuture = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
       throw new IllegalStateException(e);
    }
    return 65.0;
});

System.out.println("检索身高。");
CompletableFuture<Double> heightInCmFuture = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
       throw new IllegalStateException(e);
    }
    return 177.8;
});

System.out.println("计算 BMI。");
CompletableFuture<Double> combinedFuture = weightInKgFuture
    .thenCombine(heightInCmFuture, (weightInKg, heightInCm) -> {
    Double heightInMeter = heightInCm / 100;
    return weightInKg / (heightInMeter * heightInMeter);
});

System.out.println("你的 BMI 是 - " + combinedFuture.get());
```

传递给 `thenCombine()` 的回调函数将在两个 Futures 都完成时被调用。

## 组合多个 CompletableFuture

我们使用 `thenCompose()` 和 `thenCombine()` 来组合两个 CompletableFuture。现在，如果你想组合任意数量的 CompletableFuture，你可以使用以下方法来组合任意数量的 CompletableFuture -

```java
static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)
static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)
```

### 1. CompletableFuture.allOf()

`CompletableFuture.allOf` 在你有一组独立 futures 并希望并行运行它们并在它们全部完成后执行某些操作时使用。

假设你想下载一个网站的 100 个不同网页的内容。你可以顺序执行此操作，但这将花费很长时间。所以，你写了一个函数，它接受一个网页链接，并返回一个 CompletableFuture，即它异步下载网页的内容 -

```java
CompletableFuture<String> downloadWebPage(String pageLink) {
    return CompletableFuture.supplyAsync(() -> {
        // 代码下载并返回网页内容
    });
}
```

现在，当所有网页都下载完成后，你想计算包含关键字“CompletableFuture”的网页数量。让我们使用 `CompletableFuture.allOf()` 来实现 -

```java
List<String> webPageLinks = Arrays.asList(...) // 100 个网页链接的列表

// 异步下载所有网页的内容
List<CompletableFuture<String>> pageContentFutures = webPageLinks.stream()
    .map(webPageLink -> downloadWebPage(webPageLink))
    .collect(Collectors.toList());

// 使用 allOf() 创建组合 Future
CompletableFuture<Void> allFutures = CompletableFuture.allOf(
    pageContentFutures.toArray(new CompletableFuture[pageContentFutures.size()])
);
```

`CompletableFuture.allOf()` 的问题是它返回 `CompletableFuture<Void>`。但我们可以通过编写几行额外的代码来获取所有包装的 CompletableFuture 的结果 -

```java
// 当所有 Futures 完成后，调用 `future.join()` 获取它们的结果并将结果收集到列表中 -
CompletableFuture<List<String>> allPageContentsFuture = allFutures.thenApply(v -> {
    return pageContentFutures.stream()
        .map(pageContentFuture -> pageContentFuture.join())
        .collect(Collectors.toList());
});
```

花点时间理解上述代码片段。由于我们在所有 futures 完成后调用 `future.join()`，我们没有在任何地方阻塞 :-)

`join()` 方法类似于 `get()`。唯一的区别是，如果底层的 CompletableFuture 异常完成，它会抛出一个未检查的异常。

现在，让我们计算包含我们关键字的网页数量 -

```java
// 计算包含 "CompletableFuture" 关键词的网页数量。
CompletableFuture<Long> countFuture = allPageContentsFuture.thenApply(pageContents -> {
    return pageContents.stream()
        .filter(pageContent -> pageContent.contains("CompletableFuture"))
        .count();
});

System.out.println("包含 CompletableFuture 关键词的网页数量 - " +
        countFuture.get());
```

### 2. CompletableFuture.anyOf()

正如其名，`CompletableFuture.anyOf()` 返回一个新的 CompletableFuture，当给定的任何一个 CompletableFuture 完成时，它就完成了，并具有相同的结果。

考虑以下示例 -

```java
CompletableFuture<String> future1 = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
       throw new IllegalStateException(e);
    }
    return "Future 1 的结果";
});

CompletableFuture<String> future2 = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
       throw new IllegalStateException(e);
    }
    return "Future 2 的结果";
});

CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> {
    try {
        TimeUnit.SECONDS.sleep(3);
    } catch (InterruptedException e) {
       throw new IllegalStateException(e);
    }
    return "Future 3 的结果";
});

CompletableFuture<Object> anyOfFuture = CompletableFuture.anyOf(future1, future2, future3);

System.out.println(anyOfFuture.get()); // Future 2 的结果
```

在上面的示例中，`anyOfFuture` 在三个 CompletableFuture 中的任何一个完成时就完成了。由于 `future2` 有最少的睡眠时间，它将首先完成，最终结果将是 - Future 2 的结果。

`CompletableFuture.anyOf()` 接受 Futures 的变长参数并返回 `CompletableFuture<Object>`。`CompletableFuture.anyOf()` 的问题是，如果您有返回不同类型结果的 CompletableFutures，那么您将不知道您的最终 CompletableFuture 的类型。

## CompletableFuture 异常处理

我们探讨了如何创建 CompletableFuture、转换它们以及组合多个 CompletableFuture。现在让我们理解当出现问题时该怎么做。

首先让我们理解错误是如何在回调链中传播的。考虑以下 CompletableFuture 回调链 -

```java
CompletableFuture.supplyAsync(() -> {
    // 可能会抛出异常的代码
    return "Some result";
}).thenApply(result -> {
    return "processed result";
}).thenApply(result -> {
    return "result after further processing";
}).thenAccept(result -> {
    // 对最终结果做一些事情
});
```

如果原始的 `supplyAsync()` 任务中发生错误，那么 `thenApply()` 回调将不会被调用，并且 future 将使用发生的错误解决。如果在第一个 `thenApply()` 回调中发生错误，那么第二和第三个回调将不会被调用，并且 future 将使用发生的错误解决，依此类推。

### 1. 使用 exceptionally() 回调处理异常

`exceptionally()` 回调为您提供了一个从原始 Future 生成的错误中恢复的机会。您可以在这里记录异常并返回一个默认值。

```java
Integer age = -1;

CompletableFuture<String> maturityFuture = CompletableFuture.supplyAsync(() -> {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    if (age > 18) {
        return "Adult";
    } else {
        return "Child";
    }
}).exceptionally(ex -> {
    System.out.println("Oops! We have an exception - " + ex.getMessage());
    return "Unknown!";
});

System.out.println("Maturity : " + maturityFuture.get());
```

请注意，如果您一次处理了错误，错误将不会在回调链中进一步传播。

### 2. 使用通用的 handle() 方法处理异常

API 还提供了一个更通用的方法 - `handle()` 来从异常中恢复。无论是否发生异常，它都会被调用。

```java
Integer age = -1;

CompletableFuture<String> maturityFuture = CompletableFuture.supplyAsync(() -> {
    if (age < 0) {
        throw new IllegalArgumentException("Age cannot be negative");
    }
    if (age > 18) {
       return "Adult";
    } else {
        return "Child";
    }
}).handle((res, ex) -> {
    if (ex != null) {
        System.out.println("Oops! We have an exception - " + ex.getMessage());
        return "Unknown!";
    }
    return res;
});

System.out.println("Maturity : " + maturityFuture.get());
```

如果发生异常，那么 `res` 参数将为 null，否则，`ex` 参数将为 null。


