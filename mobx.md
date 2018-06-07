#前言
原本說接下來會專注學nodejs,但是最新工作又學習了一些有意思的庫,於是就再寫下來做個簡單的入門,之前我寫過一篇文章,這個也算是作為一個補充吧.


#Mobx
通過透明的響應式編程使狀態管理變得簡單和可擴展,背後哲學是任何源自應用狀態的東西都應自動獲得,(包括UI,數據序列化,服務器通訊等)

React通過提供機制把應用狀態轉換成可渲染組件樹並對其渲染,優化UI渲染,就是通過使用虛擬DOM減少昂貴的DOM變化數量. Mobx提供機制來存儲和更新應用狀態供React使用,優化應用狀態和React組件同步,通過使用響應式的虛擬依賴狀態圖表,讓其在需要的時候才更新並且保持最新.

這是與Redux相比除了目的一致是管理應用狀態之外沒什麼相似之處了.不管是寫法還是思想都截然不同.因為才剛入門,這裡只說用法不講區別.


##官方代碼
我們先看看這段代碼做了什麼,再分開詳細講解一下對應知識點
1, observable(組件): 轉成響應式組件,會自動轉換應用狀態和更新;
2, get 函數: 計算值,根据现有的状态或其它计算值衍生出的值;
3, autorun函數: 類似get,依赖关系改变时觸發;
4, action: 改變狀態,嚴格模式下所有修改操作都應該再action裡面執行;
import {observable, autorun} from 'mobx';

var todoStore = observable({
    /* 一些观察的状态 */
    todos: [],

    /* 推导值 */
    get completedCount() {
        return this.todos.filter(todo => todo.completed).length;
    }
});

/* 观察状态改变的函数 */
autorun(function() {
    console.log("Completed %d of %d items",
        todoStore.completedCount,
        todoStore.todos.length
    );
});

/* ..以及一些改变状态的动作 */
todoStore.todos[0] = {
    title: "Take a walk",
    completed: false
};
// -> 同步打印 'Completed 0 of 1 items'

todoStore.todos[0].completed = true;
// -> 同步打印 'Completed 1 of 1 items'


#State(状态)
##observable
//標準用法
observable(value)
//裝飾器用法
@observable classProperty = value
//裝飾器兼容寫法
decorate

Observable 值可以是JS基本数据类型、引用类型、普通对象、类实例、数组和映射。 匹配类型应用了以下转换规则，但可以通过使用调节器进行微调。
1) Map: 返回一个新的 Observable Map,不但对一个特定项的更改做出反应，而且对添加或删除该项也做出反应;
2) 数组: 会返回一个 Observable Array;
3) 没有原型的对象: 那么对象会被克隆并且所有的属性都会被转换成可观察的;
4) 有原型的对象: JavaSript 原始数据类型或者函数，observable會拋出錯誤,如果你想要創建一個獨立的observable引用例如值可以使用Boxed Observable observables。MobX 不会将一个有原型的对象自动转换成可观察的，因为这是它构造函数的职责。可以在constructor使用extendObservable或者類型定義使用decorate替代.



###observable(new Map())/observable.map(values, options)
values: 可以是对象、 数组或者字符串键的 ES6 map;
options:
1) deep: 決定分配给 observable 映射的值會否通过 observable 来传递使其转变成可观察的;
2) name: 调试名称，用于 spy 或者 MobX 开发者工具;

const map = observable.map(new Map());

以下是MobX 提供方法:
1) toJS(): 将 observable 映射转换成普通映射;
2) toJSON(): 返回此映射的浅式普通对象表示。(想要深拷贝，请使用 mobx.toJS(map));
3) intercept(interceptor): 可以用来在任何变化作用于映射前将其拦截;
4) observe(listener, fireImmediately?): 注册侦听器，在映射中的每个更改时触发;
5) merge(values): 把提供对象的所有项拷贝到映射中。values 可以是普通对象、entries 数组或者 ES6 字符串键的映射;
6) replace(values): 用提供值替换映射全部内容。是 .clear().merge(values) 的简写形式;

###observable([])/observable.array(values, options)
这是递归的，所以数组中的所有(未来的)值都会是可观察的.
options:
1) deep: 決定分配给 observable 映射的值會否通过 observable 来传递使其转变成可观察的;
2) name: 调试名称，用于 spy 或者 MobX 开发者工具;


const ary = observable.array([1, 2, 4]);

注意:
observable.array 会创建一个人造数组(类数组对象)来代替真正的数组。 支持所有的原生方法，包括从索引的分配到包含数组长度。
1) 驗證類型方法的話返回不是數組.可以通过使用 array.slice() 在 observable 数组传递给外部库或者内置方法前创建一份浅拷贝;
2) sort 和 reverse 函数實現不会改变数组本身，而是返回一个排序过/反转过的拷贝;

以下是MobX 提供方法:
1) intercept(interceptor): 可以用来在任何变化作用于数组前将其拦截;
2) observe(listener, fireImmediately? = false): 监听数组的变化。回调函数将接收表示数组拼接或数组更改的参数，它符合 ES7 提议。它返回一个清理函数以用来停止监听器;
3) clear(): 从数组中删除所有项;
4) replace(newItems): 用新项替换数组中所有已存在的项;
5) find(predicate: (item, index, array) => boolean, thisArg?): 基本上等同于 ES7 的 Array.find 提议;
6) findIndex(predicate: (item, index, array) => boolean, thisArg?): 基本上等同于 ES7 的 Array.findIndex 提议;
7) remove(value): 通过值从数组中移除一个单个的项。如果项被找到并移除的话，返回 true ;
8) peek(): 和 slice() 类似,返回一个有所有值的数组并且数组可以放心的传递给其它库,但是不创建保护性拷贝;


###observable({})/observable.object(props, decorators?, options?)
一个普通的 JavaScript 对象 (指不是使用构造函数创建出来的对象，而是以 Object 作为其原型，或者根本没有原型)传递给 observable 方法，对象的所有属性都将被拷贝至一个克隆对象并将克隆对象转变成可观察的。
这是递归应用的，所以如果对象的某个值是一个对象或数组，那么该值也将通过 observable 传递.
options:
1) deep: 決定分配给 observable 映射的值會否通过 observable 来传递使其转变成可观察的;
2) name: 调试名称，用于 spy 或者 MobX 开发者工具;

const obj = observable.object({ key: "value"});

注意:
1) 当通过 observable 传递对象时，只有在把对象转变 observable 时存在的属性才会是可观察的。 稍后添加到对象的属性不会变为可观察的，除非使用 set 或 extendObservable;
2) 只有普通的对象可以转变成 observable 。对于非普通对象，构造函数负责初始化 observable 属性。 要么使用 @observable 注解(annotation,這個解釋不太懂??)，要么使用 extendObservable 函数;
3) 属性的 getter 会自动转变成衍生属性，就像 @computed 所做的;
4) observable 是自动递归到整个对象的。在实例化过程中和将来分配给 observable 属性的任何新值的时候。Observable 不会递归到非普通对象中;
5) 更细粒度的控制，比如哪些属性应该转变成可观察的和如何变成可观察的，请参见装饰器;


###observable.box(value)
JavaScript 中的所有原始类型值都是不可变的，因此它们都是不可观察的,box创建一个基于 ref 装饰器的箱子。这意味着箱子里的任何(将来)值都不会自动地转换成 observable 。
options:
1) name: 调试名称，用于 spy 或者 MobX 开发者工具;

const box = observable.box("box");
box.observe(function(change) {
    console.log(change.oldValue, "->", change.newValue);
});

以下是box提供方法:
1) get(): 返回当前值;
2) set(value): 替换当前存储的值并通知所有观察者;
3) intercept(interceptor): 可以用来在任何变化应用前将其拦截;
4) observe(callback: (change) => void, fireImmediately = false): 注册一个观察者函数，每次存储值被替换时触发。返回一个函数以取消观察者.change是一个对象，其中包含 observable 的 newValue 和 oldValue 。

###装饰器
定义 observable 属性的行为,默认为对任意键值对使用 observable.deep，对 getters 使用 computed 。
observable: observable.deep 的别名
observable.deep: 任何 observable 都使用的默认的调节器。它将任何(尚未成为 observable )数组，映射或纯对象克隆并转换为 observable 对象，并将其赋值给给定属性
observable.ref: 禁用自动的 observable 转换，只是创建一个 observable 引用
observable.shallow: 只能与集合组合使用。 将任何分配的集合转换为 observable，但该集合的值将按原样处理
observable.struct: 就像 ref, 但会忽略结构上等于当前值的新值
computed: 创建一个衍生属性, 参见 computed
computed(options): 同 computed , 可设置选项
computed.struct: 与 computed 相同，但是只有当视图产生的值与之前的值结构上有不同时，才通知它的观察者
action: 创建一个动作, 参见 action
action(name): 创建一个动作，重载了名称
action.bound: 创建一个动作, 并将 this 绑定到了实例

class Person {
    name = "John"
}
// 使用 decorate 时，所有字段都应该指定 (毕竟，类里的非 observable 字段可能会更多)
decorate(Person, {
    name: observable,
})




#Derivations(衍生)
任何源自状态并且不会再有任何进一步的相互作用的东西就是衍生,衍生以多种形式存在:
* 用户界面
* 衍生数据，比如剩下的待办事项的数量。
* 后端集成，比如把变化发送到服务器端。

MobX 区分两种类型的衍生:
* Computed values(计算值): 它们是永远可以使用纯函数(pure function)从当前可观察状态中衍生出的值;
* Reactions(反应): Reactions 是当状态改变时需要自动发生的副作用。需要有一个桥梁来连接命令式编程(imperative programming)和响应式编程(reactive programming)。或者说得更明确一些，它们最终都需要实现I / O 操作;


##(@)computed
计算值(computed values)是可以根据现有的状态或其它计算值衍生出的值.如果你想响应式的产生一个可以被其它 observer 使用的值，请使用 @computed.计算值在大多数情况下可以被 MobX 优化的,例如:
1) 前一个计算中使用的数据没有更改，计算属性将不会重新运行;
2) 某个其它计算属性或 reaction 未使用该计算属性，也不会重新运行。 在这种情况下，它将被暂停;
3) 一个计算值不再被观察了，例如使用它的UI不复存在了，MobX 可以自动地将其垃圾回收;


注意:
1) 计算属性是不可枚举的，它们也不能在继承链中被覆盖;
2) 可以使用 observe 或 keepAlive 来强制保持计算值总是处于唤醒状态;
3) observable.object 和 extendObservable 都会自动将 getter 属性推导成计算属性;
4) 如果计算值在其计算期间抛出异常，则此异常将捕获并在读取其值时重新抛出。 强烈建议始终抛出“错误”，以便保留原始堆栈跟踪。 抛出异常不会中断跟踪，所有计算值可以从异常中恢复。


计算值的 setter:
1) 不能用来直接改变计算属性的值，但是它们可以用来作“逆向”衍生.就是反向計算;
2) 必須在 getter 之后定义 setter，一些 TypeScript 版本会知道声明了两个具有相同名称的属性;
3) 这是一个自动的动作，只需要直接使用set xx(){};

class Test {
    @observable num = 0;

    @computed get total() {
        return this.num * 10;
    }

    set total(value) {
        this.num = value / 10;
    }
}
//OR
const Test = observable.object({
    num: 0;

    get total() {
        return this.num * 10;
    }

    set total(value) {
        this.num = value / 10;
    }
})


###computed(expression,options) 函数用法
某些情况下，你需要传递一个“在box中”的计算值时，它可能是有用的。
options:
1) name: 调试名称，用于 spy 或者 MobX 开发者工具;
2) context: 在提供的表达式中使用的 this;
3) set: 要使用的setter函数。 没有 setter 的话无法为计算值分配新值。 如果传递给 computed 的第二个参数是一个函数，那么就把会这个函数作为 setter;
4) equals: 默认值是 comparer.default 。它充当比较函数。如果前后值相等，那么观察者就不会重新评估;
5) requiresReaction: 对于非常昂贵的计算值，推荐设置成 true 。如果你尝试读取它的值，但某些观察者没有跟踪该值（在这种情况下，MobX 不会缓存该值），则会导致计算结果丢失，而不是进行昂贵的重新评估;
6) keepAlive: 如果没有任何人观察到，则不要使用此计算值。 请注意，这很容易导致内存泄漏，因为它会导致此计算值使用的每个 observable ，并将计算值保存在内存中;

MobX 提供了三个内置 comparer (比较器) :
comparer.identity: 使用恒等 (===) 运算符来判定两个值是否相同;
comparer.default: 等同于 comparer.identity，但还认为 NaN 等于 NaN ;
comparer.structural: 执行深层结构比较以确定两个值是否相同;

const box = observable("box"),
    upperCaseName = computed(() =>
        name.get().toUpperCase()
    ),
    disposer = upperCaseName.observe(change => console.log(change.newValue));
box.set("Dave");


###Autorun(expression,options)
创建一个响应式函数，而该函数本身永远不会有观察者,调用后将接收一个参数，即当前 reaction(autorun)，可用于在执行期间清理 autorun。 当使用 autorun 时，所提供的函数总是立即被触发一次，然后每次它的依赖关系改变时会再次被触发,相比之下computed(function)创建的函数只有当它有自己的观察者时才会重新计算，否则它的值会被认为是不相关的;
options:
1) delay: 可用于对效果函数进行去抖动的数字(以毫秒为单位)。如果是 0(默认值) 的话，那么不会进行去抖。
2) name: 调试名称，用于 spy 或者 MobX 开发者工具;
3) onError: 用来处理 reaction 的错误，而不是传播它们;
4) scheduler: 设置自定义调度器以决定如何调度 autorun 函数的重新运行;


var numbers = observable([1,2,3]);
var sum = computed(() => numbers.reduce((a, b) => a + b, 0));

var disposer = autorun(() => console.log(sum.get()));
// 输出 '6'
numbers.push(4);
// 输出 '10'

disposer();
//清理 autorun
numbers.push(5);
// 不会再输出任何值。`sum` 不会再重新计算。



###when(predicate: () => boolean, effect?: () => void, options?)
when 观察并运行给定的 predicate，直到返回true。 一旦返回 true，给定的 effect 就会被执行，然后 autorunner(自动运行程序) 会被清理。 该函数返回一个清理器以提前取消自动运行程序。
class MyResource {
    constructor() {
        when(
            // 一旦...
            () => !this.isVisible,
            // ... 然后
            () => this.dispose()
        );
    }

    @computed get isVisible() {
        // 标识此项是否可见
    }

    dispose() {
        // 清理
    }
}


###when-promise
如果没提供 effect 函数，when 会返回一个 Promise 。它与 async / await 可以完美结合。

async function() {
    await when(() => that.isVisible)
    // 等等..
}


##reaction(() => data, (data, reaction) => { sideEffect }, options?)
第一个數據函数是用来追踪并返回数据作为第二个作用函数的入參。 不同于 autorun 的是当创建时函数不会直接运行，只有在数据表达式首次返回一个新值后才会运行。 在执行作用函数时访问的任何 observable 都不会被追踪。

reaction 返回一个清理函数,接收两个参数，即当前的 reaction，可以用来在执行期间清理 reaction 。

作用函数仅对数据函数中访问的数据作出反应，这可能会比实际在作用函数使用的数据要少。 此外，作用函数只会在表达式返回的数据发生更改时触发。 换句话说: reaction需要你生产作用函数中所需要的东西。

options:
1) fireImmediately: 布尔值，用来标识效果函数是否在数据函数第一次运行后立即触发。默认值是 false，如果一个布尔值作为传给 reaction 的第三个参数，那么它会被解释为 fireImmediately 选项;
2) delay: 可用于对效果函数进行去抖动的数字(以毫秒为单位)。如果是 0(默认值) 的话，那么不会进行去抖;
3) equals: 默认值是 comparer.default 。它充当比较函数。如果前后值相等，那么观察者就不会重新评估;
4) name: 调试名称，用于 spy 或者 MobX 开发者工具;
5) onError: 用来处理 reaction 的错误，而不是传播它们;
6) scheduler: 设置自定义调度器以决定如何调度 autorun 函数的重新运行:


const todos = observable([
    {
        title: "test1"
    }, {
        title: "test2"
    }
]);

//会对長度变化作出反应
reaction(() => todos.length, length => console.log("reaction 1:", todos.map(todo => todo.title).join(", ")));
//会对某个 todo 的 title 变化作出反应
reaction(() => todos.map(todo => todo.title), titles => console.log("reaction 2:", titles.join(", ")));

// autorun 对它函数中使用的任何东西作出反应
autorun(() => console.log("autorun:", todos.map(todo => todo.title).join(", ")));
// 输出:
// autorun: test1

action(() => {
    todos.push({title: "test3"});
})()
// 输出:
// autorun: test1, test2, test3
// reaction 2: test1, test2, test3
// reaction 1: test1, test2, test3

action(() => {
    todos[1].title = 'test4';
})()
// 输出:
// autorun: test1, test4, test3
// reaction 2: test1, test4, test3




###@observer
observer 函数/装饰器可以用来将 React 组件/无状态函数组件转变成响应式组件。 它用 mobx.autorun 包装了组件的 render 函数以确保任何组件渲染中使用的数据变化时都可以强制刷新组件。
1) observer 是由单独的 mobx-react 包提供的。确保 observer 是最深处(第一个应用)的装饰器，否则它可能什么都不做;
2) 如果传递给组件的数据是响应式的,observer还可以防止当组件的 props 只是浅改变时的重新渲染,这个行为与 React PureComponent 相似，不同在于这里的 state 的更改仍然会被处理。 如果一个组件提供了它自己的 shouldComponentUpdate，这个方法会被优先调用;


import {observer} from "mobx-react";
var timerData = observable({
    secondsPassed: 0
});

setInterval(() => {
    timerData.secondsPassed++;
}, 1000);

@observer class Timer extends React.Component {
    render() {
        return (<span>Seconds passed: { this.props.timerData.secondsPassed } </span> )
    }
};
//OR
const Timer = observer(({ timerData }) =>
    <span>Seconds passed: { timerData.secondsPassed } </span>
);

###可观察的局部组件状态
@observer class Timer extends React.Component {
    @observable secondsPassed = 0

    componentWillMount() {
        setInterval(() => {
            this.secondsPassed++
        }, 1000)
    }

    render() {
        return (<span>Seconds passed: { this.secondsPassed } </span> )
    }
}
在React组件上引入可观察属性。 这意味着你可以在组件中拥有功能同样强大的本地状态(local state)，而不需要通过 React 的冗长和强制性的 setState 机制来管理。 响应式状态会被 render 提取调用，但不会调用其它 React 的生命周期方法，除了 componentWillUpdate 和 componentDidUpdate 。 如果你需要用到其他 React 生命周期方法 ，只需使用基于 state 的常规 React API 即可。


###组件连接stores
const App = () =>
  <Provider colors={colors}>
     <app stuff... />
  </Provider>;

const Button = inject("colors")(observer(({ colors, label }) =>
  <button style={{
      color: colors.foreground
    }}
  >{label}<button>
));

###提供生命週期componentWillReact
当组件重新渲染时被触发,这使得它很容易追溯渲染并找到导致渲染的操作(action).
1) 不接收参数;
2) 初始化渲染前不会触发 (使用 componentWillMount 替代);
3) 对于 mobx-react@4+, 当接收新的 props 时并在 setState 调用后会触发此钩子;





##action (动作)
action(fn)
action(name, fn)
@action classMethod() {}
@action(name) classMethod () {}
@action boundClassMethod = (args) => { body }
@action(name) boundClassMethod = (args) => { body }
@action.bound classMethod() {}

action可以是任何用来修改状态的东西,只执行查找，过滤器等函数不应该被标记为action，以允许 MobX 跟踪它们的调用.可以有助于更好的组织代码.


###action.bound
自动地将动作绑定到目标对象。与 action 不同的是不需要一个name参数，名称将始终基于动作绑定的属性。
因為箭头函数已经是绑定过的并且不能重新绑定,所以不能一起使用
class Ticker {
    @observable tick = 0

    @action.bound
    increment() {
        this.tick++ // 'this' 永远都是正确的
    }
}





##编写异步 Actions
action 包装/装饰器只会对当前运行的函数作出反应，而不会对当前运行函数所调用的函数（不包含在当前函数之内）作出反应！ 这意味着如果 action 中存在 setTimeout、promise 的 then 或 async 语句，并且在回调函数中某些状态改变了，那么这些回调函数也应该包装在 action 中。

錯誤寫法,抛出异常
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    fetchProjects() {
        this.status = "yellow"
        toggleLight().then(
            res => {
                this.status = "green"
            },
            err => {
                this.status = "red"
            }
        )
    }
}

//包裝修復在action
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    handleAjax() {
        this.status = "yellow"
        toggleLight().then(
            this.handleSuc,
            this.handleErr
        )
    }

    @action.bound
    handleSuc(res){
        this.status = "green"
    }

    @action.bound
    handleErr(err){
        this.status = "red"
    }

}

//另一種內嵌寫法
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    handleAjax() {
        this.status = "yellow"
        toggleLight().then(
            action('handleSuc',res => {
                this.status = "green"
            }),
            action('handleErr',res => {
                this.status = "red"
            })
        )
    }
}


runInAction(name?, thunk)
runInAction 是个简单的工具函数，它接收代码块并在(异步的)动作中执行。这对于即时创建和执行动作非常有用.
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    handleAjax() {
        this.status = "yellow"
        toggleLight().then(
            runInAction(res => {
                this.status = "green"
            }),
            runInAction(res => {
                this.status = "red"
            })
        )
    }
}



async / await
async / await 只是围绕基于 promise 过程的语法糖。 结果是 @action 仅应用于代码块，直到第一个 await 。 在每个 await 之后，一个新的异步函数将启动，所以在每个 await 之后，状态修改代码应该被包装成动作。
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    async handleAjax() {
        this.status = "yellow"
        toggleLight().then(
            try{
                const result = await dosometings();
                runInAction(res => {
                    this.status = result;
                }),
            }catch(err){
                runInAction(res => {
                    this.status = "red";
                })
            }
        )
    }
}


flows内置概念
优点是它在语法上基本与 async / await 是相同的 (只是关键字不同)，并且不需要手动用 @action 来包装异步代码，这样代码更简洁。
class TrafficLight {
    @observable status = "yellow" // "red" / "green" / "yellow"

    @action
    handleAjax = flow(function* () {
        this.status = "yellow"
        toggleLight().then(
            try{
                const result = yield dosometings();
                this.status = result;
            }catch(err){
                this.status = "red";
            }
        )
    })
}


##工具 API
这些 API 都是响应式的，这意味着如果使用 set 进行添加，使用 values 或 keys 进行迭代，即便是新属性的声明都可以被 MobX 检测到.
1) values(thing): 将集合中的所有值作为数组返回;
2) keys(thing): 将集合中的所有键作为数组返回;
3) set(thing, key, value)/set(thing, { key: value }): 使用提供的键值对来更新给定的集合;
4) remove(thing, key): 从集合中移除指定的项。用于数组拼接;
5) has(thing, key): 如果集合中存在指定的 observable 属性就返回 true;
6) get(thing, key): 返回指定键下的子项;

import { get, set, observable, values } from "mobx"

const twitterUrls = observable.object({
    "John": "twitter.com/johnny"
})

autorun(() => {
    console.log(get(twitterUrls, "Sara")) // get 可以追踪尚未存在的属性
})

autorun(() => {
    console.log("All urls: " + values(twitterUrls).join(", "))
})

set(twitterUrls, { "Sara" : "twitter.com/horsejs"})


##Mobx工具函數
不想摘抄了,看文檔吧...
[Mobx](https://cn.mobx.js.org/refguide/tojson.html)6. 工具函数


##Mobx技巧與問題
不想摘抄了,看文檔吧...
[Mobx](https://cn.mobx.js.org/refguide/tojson.html)8. 贴士与技巧
