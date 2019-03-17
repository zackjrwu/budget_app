//  模組化程式
//  私有與公開的資料分開(不被任意修改) 封裝 data encapsulation

/**** UI Module ****/
/*

1. Get input values.
2. Add the new item to the UI.
3. Update the UI.

*/

var UIController = (function () {
    //  好維護與方便使用的頁面選取物件資訊
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        incBudget: '.budget__income--value',
        expBudget: '.budget__expenses--value',
        budgetLabel: '.budget__value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        // 1. + or -
        // 580000 -> 580,000
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3)
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);

        return (type === 'exp' ? '-' : '+') + ' ' + int;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        //  得到使用者輸入資訊的方法(公開)
        getinput: function () {
            //  此方法回傳物件
            return {
                //  存錢或是提錢型態
                type: document.querySelector(DOMstrings.inputType).value,
                //  當下操作的說明
                description: document.querySelector(DOMstrings.inputDescription).value,
                //  當下操作的金額
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        //  增加欄位到頁面方法(公開)
        addListItem: function (obj, type) {
            //  creat HTML string with placeholder text
            var html, element;
            //
            if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `
                <div class="item clearfix" id="exp-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumber(obj.value, type)}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            } else if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `
                <div class="item clearfix" id="inc-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">${formatNumber(obj.value, type)}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        //  資料接收完後清空輸入視窗方法(公開)
        clearInput: function () {
            //  clean the input field 
            // document.querySelector(DOMstrings.inputType).selectedIndex = "0";
            document.querySelector(DOMstrings.inputDescription).value = "";
            document.querySelector(DOMstrings.inputValue).value = "";
            document.querySelector(DOMstrings.inputDescription).focus();
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incBudget).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expBudget).textContent = formatNumber(obj.totalExp, 'exp');

            // document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

            if (obj.percentage > 0)
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            else
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                    current.textContent = '---';
            });
        },

        displayMonth: function () {
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = year + ' ' + months[month];

        },

        changeType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        //  使其他地方方便使用 DOM 物件資料的方法(公開)
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();


/**** Data Module ****/
/*

1 Add the new item to our data structure.
2. Calculate budget.

*/

var budgetController = (function () {
    //  function sonstroctor 賺錢的建構子類別
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    //  function sonstroctor 花錢的建構子類別
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    //  所有資料物件
    var data = {
        //  物件中的詳細資料物件
        allItems: {
            exp: [],
            inc: []
        },
        //  物件中的金錢物件
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        //  加入賺錢或花錢到 data 資料物件裡的方法(公開)
        addItem: function (type, des, val) {
            var newItem, ID;

            // [1,2,3,4,5], next ID = 6
            // [1,2,4,6,8], next ID = 9

            //  生成 id 從 0 開始
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;
            //  如果是 exp 就生成 Expense 物件
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            //  如果是 inc 就生成 Income 物件
            else if (type === 'inc')
                newItem = new Income(ID, des, val);
            //  生成完物件後放入陣列的物件中
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);
            if (index !== -1)
                data.allItems[type].splice(index, 1);
        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else
                data.percentage = -1;
        },

        calculatePercentages: function () {
            /*
                a=20
                b=10
                c=40
                income = 100
                a=20/100=20%
                b=10/100=10%
                c=40/100=40%
            */

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });


        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        //  測試用方法(公開)
        testing: function () {
            console.log(data);
        }
    };
})();



/**** Controller Module ****/
/*

Add event handler.

*/

//  Global app controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        //  得到 Ui 控制器裡的 DOM
        var DOM = UICtrl.getDOMstrings();
        //  在頁面上的綠色勾勾按鈕加上監聽使用者是否按下的事件, 若按下執行 ctrlAddItem()
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        //  在頁面上加上監聽使用者是否按下 Enter 的事件, 若按下執行 ctrlAddItem()
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13)
                ctrlAddItem();
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function () {
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        //1. calculate percentages
        budgetCtrl.calculatePercentages();
        //2. read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        //3. update the uo with the new percentages
        UICtrl.displayPercentages(percentages);
    };


    //  當使用者要確定送出資料時所要做的函式
    var ctrlAddItem = function () {
        var input, newItem;
        //  1. Get input data
        input = UICtrl.getinput();

        //  錯誤處理: 描述為空或是金額為空或是金額不合理
        if (input.description.trim() === "" || isNaN(input.value) || input.value <= 0) {
            alert('Please type the right things!');
            UICtrl.clearInput();
        } else {
            //  2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //  3. Add the new item to the UI
            UICtrl.addListItem(newItem, input.type);
            //  3.5 clear the fields
            UICtrl.clearInput();
            //  4. Calculate the budget
            updateBudget();
            //  5
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event) {
        // console.log('ccc');
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            // console.log(itemID);
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //  1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            //  2. delete the item from the UI
            UICtrl.deleteListItem(itemID);
            //  3. Update and show the new budget
            updateBudget();
            //  4
            updatePercentages();
        }
    };

    return {
        //  啟動所有程序方法(公開)
        init: function () {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            //  啟動監聽
            setupEventListeners();
        }
    };

    //  為了之後維護改名方便
})(budgetController, UIController);

controller.init();