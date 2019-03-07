//  較為模組化的架構

// var budgetController = (function () {
//     var x = 23;
//     var add = function (a) {
//         return x + a;
//     };
//     return {
//         publicTest: function (b) {
//             return (add(b));
//         }
//     };
// })();

// var UIcontroller = (function () {
//     //Some code
// })();

// var controller = (function (budgetCtrl, UICtrl) {
//     var z = budgetCtrl.publicTest(15);
//     return {
//         anotherPublic: function () {
//             console.log(z);
//         }
//     };
// })(budgetController, UIcontroller);



//  budget Controller
var budgetController = (function () {
    var Exp = function (id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    };
    var Inc = function (id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //  [1 2 3 4 5], next ID = 6
            //  [1 3 6 9], next ID = 10
            if (data.allItems[type].length > 0) {
                //      當下操作的位置    當下操作位置的最後一個的 index 的 id  +1 
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                // 如果當下沒有任何東西則把 ID 設為從 0 開始  
                ID = 0;
            }

            if (type === 'exp')
                newItem = new Exp(ID, des, val);

            else if (type === 'inc')
                newItem = new Inc(ID, des, val);

            data.allItems[type].push(newItem);
            return newItem;
        },
        testing: function () {
            console.log(data);
        }
    };
})();



//  UI Controller
var UIcontroller = (function () {
    //  UI 使用的操作 class obj
    var DOMstrings = {
        inptType: '.add__type',
        inputDesc: '.add__description',
        inputVal: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    return {
        //  得到頁面的輸入視窗資料方法
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inptType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                val: parseFloat(document.querySelector(DOMstrings.inputVal).value)
            };
        },
        addListItem: function (obj, type) {
            //create HTML string with placeholder 
            var html, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `
                <div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.val}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = `
                <div class="item clearfix" id="expense-${obj.id}">
                    <div class="item__description">${obj.desc}</div>
                    <div class="right clearfix">
                        <div class="item__value">${obj.val}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        //  送出資料時的輸入視窗清空
        clearInput: function () {
            //  clean the input field 
            document.querySelector(DOMstrings.inptType).selectedIndex = "0";
            document.querySelector(DOMstrings.inputDesc).value = "";
            document.querySelector(DOMstrings.inputVal).value = "";
            document.querySelector(DOMstrings.inputDesc).focus();
        },
        //  得到頁面操控元素資訊的方法
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();



//  Global app Controller
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventListeners = function () {
        //  頁面操控需要的元素資訊
        var DOM = UICtrl.getDOMstrings();
        //  use button to submit 按鈕送出
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        //  use Enter to submit 鍵盤送出
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateDudget = function () {
        //  1. Calculate the budget
        //  2. Return the budget
        //  3. Display the ui
    };

    var ctrlAddItem = function () {
        var input, newItem;

        //  1. get the field input data
        input = UICtrl.getInput();

        // console.log(input);
        if (input.desc.trim() === "" || isNaN(input.val) || input.val <= 0) {
            alert('Please type the right things!');
            UICtrl.clearInput();
        } else {
            //  2. add item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.desc, input.val);

            //  3. add the item to the ui

            UICtrl.addListItem(newItem, input.type);

            //  3.5 clear the fields

            UICtrl.clearInput();

            //  4. calculate and update budget

            updateDudget();

            //  5. display the budget on the ui

            //console.log('SO cool');
        }



    };

    return {
        init: function () {
            console.log('APP has started.');
            setupEventListeners();
        }
    };
})(budgetController, UIcontroller);

//  初始化
controller.init();