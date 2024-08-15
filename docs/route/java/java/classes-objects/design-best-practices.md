# 最佳实践

## 选择使用嵌套类、局部类、匿名类和Lambda表达式

如嵌套类部分所述，嵌套类使您能够逻辑上分组只在一个地方使用的类，增加封装的使用，并创建更易于阅读和维护的代码。局部类、匿名类和Lambda表达式也带来这些优势；然而，它们旨在用于更特定的情形：

1. **局部类**：如果您需要创建一个类的多个实例、访问其构造函数或引入一个新的命名类型（因为，例如，您之后需要调用其他方法），请使用它。
2. **匿名类**：如果您需要声明字段或附加方法，请使用它。
3. **Lambda表达式**：
   - 如果您正在封装一个想要传递给其他代码的单一行为单元，请使用它。例如，如果您希望在集合的每个元素上执行某个动作、某个过程完成时或某个过程遇到错误时，请使用Lambda表达式。
   - 如果您需要一个简单的函数式接口实例，并且前面的条件都不适用（例如，您不需要构造函数、命名类型、字段或附加方法），请使用它。
4. **嵌套类**：如果您的要求与局部类类似，您希望使类型更广泛可用，并且您不需要访问局部变量或方法参数，请使用它。
5. 如果您需要访问外围实例的非公共字段和方法，请使用非静态嵌套类（或内部类）。如果您不需要这种访问，请使用静态嵌套类。
