# Clock

## Clock
大多数基于时间的对象提供了一个无参数的`now()`方法，该方法使用系统时钟和默认时区提供当前日期和时间。这些基于时间的对象还提供了一个单参数的`now(Clock)`方法，允许您传入一个替代的`Clock`。
当前日期和时间取决于时区，对于全球化的应用程序，`Clock`是必要的，以确保使用正确的时区创建日期/时间。因此，尽管`Clock`类的使用是可选的，但此功能允许您针对其他时区测试您的代码，或使用固定时钟，其中时间不会改变。
`Clock`类是抽象的，因此您不能创建它的实例。以下工厂方法对于测试可能很有用。
- `Clock.offset(Clock, Duration)`返回一个偏移了指定`Duration`的时钟。
- `Clock.systemUTC()`返回一个表示格林威治/UTC 时区的时钟。
- `Clock.fixed(Instant, ZoneId)`始终返回相同的`Instant`。对于这个时钟，时间静止不动。