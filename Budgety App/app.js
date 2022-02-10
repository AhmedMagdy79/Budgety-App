var budgetController = (function () {
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };
    Expense.prototype.calcPrecentage = function (totalInc) {
        if (totalInc > 0) {
            this.precentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.precentage = -1;
        }
    };

    Expense.prototype.getPrecentage = function () {
        return this.precentage;
    };

    calcuToltal = function (type) {
        sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        allItems: {
            inc: [],
            exp: [],
        },
        totals: {
            inc: 0,
            exp: 0,
        },
        budget: 0,
        precentage: -1,
    };

    return {
        addItem: function (type, des, val) {
            var id, newitem;
            if (data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }
            //creating a new item
            if (type === "exp") {
                newitem = new Expense(id, des, val);
            } else if (type === "inc") {
                newitem = new Income(id, des, val);
            }
            // adding the new item to the arrays
            data.allItems[type].push(newitem);
            // return the new element
            return newitem;
        },
        deleteItem: function (type, id) {
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            //calculate tottal inc and exp
            calcuToltal("inc");
            calcuToltal("exp");
            // calculate total budget
            data.budget = data.totals.inc - data.totals.exp;
            //calculate precentage
            if (data.totals.inc > 0) {
                data.precentage = Math.round(
                    (data.totals.exp / data.totals.inc) * 100
                );
            } else {
                data.precentage = -1;
            }
        },

        calculatePrecentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPrecentage(data.totals.inc);
            });
        },

        getPrecentage: function () {
            allPrec = data.allItems.exp.map(function (cur) {
                return cur.getPrecentage();
            });
            return allPrec;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                precentage: data.precentage,
            };
        },

        testing: function () {
            console.log(data);
        },
    };
})();

var uiController = (function () {
    domStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputvalue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        precentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPreceLabel: ".item__percentage",
        dateLabel: ".budget__title--month",
    };

    var formatNumber = function (num, type) {
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split(".");

        (int = numSplit[0]), (dec = numSplit[1]);
        if (int.length > 3) {
            int =
                int.substr(0, int.length - 3) +
                "," +
                int.substr(int.length - 3, 3);
        }
        return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value, //inc or exp
                description: document.querySelector(domStrings.inputDescription)
                    .value,
                value: parseFloat(
                    document.querySelector(domStrings.inputvalue).value
                ),
            };
        },
        addLIstItem: function (obj, type) {
            if (type === "inc") {
                element = domStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp") {
                element = domStrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newhtml = newHtml.replace("%value%", formatNumber(obj.value, type));

            document
                .querySelector(element)
                .insertAdjacentHTML("beforeend", newhtml);
        },
        getDomStrings: function () {
            return domStrings;
        },
        deleteListItem: function (slectorId) {
            el = document.getElementById(slectorId);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            fields = document.querySelectorAll(
                domStrings.inputDescription + ", " + domStrings.inputvalue
            );
            arrfields = Array.prototype.slice.call(fields);
            arrfields.forEach(function (current, index) {
                current.value = "";
            });
            document.querySelector(domStrings.inputDescription).focus();
        },
        displayBudget: function (obj) {
            type = obj.budget >= 0 ? "inc" : "exp";
            document.querySelector(domStrings.budgetLabel).textContent =
                formatNumber(obj.budget, type);
            document.querySelector(domStrings.incomeLabel).textContent =
                formatNumber(obj.totalInc, "inc");
            document.querySelector(domStrings.expensesLabel).textContent =
                formatNumber(obj.totalExp, "exp");

            if (obj.precentage > 0) {
                document.querySelector(domStrings.precentageLabel).textContent =
                    obj.precentage + "%";
            } else {
                document.querySelector(domStrings.precentageLabel).textContent =
                    "__";
            }
        },
        displayPrecentages: function (precentages) {
            fields = document.querySelectorAll(domStrings.expensesPreceLabel);
            nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function (cur, index) {
                if (precentages[index] > 0) {
                    cur.textContent = precentages[index] + "%";
                } else {
                    cur.textContent = "__";
                }
            });
        },
        displaydate: function () {
            now = new Date();

            months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(domStrings.dateLabel).textContent =
                months[month] + " " + year;
        },
    };
})();

var controller = (function (ui, budget) {
    var setupEventLisenters = function () {
        var dom = ui.getDomStrings();
        document
            .querySelector(dom.inputBtn)
            .addEventListener("click", ctrlAddItem);
        document.addEventListener("keypress", function (event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document
            .querySelector(dom.container)
            .addEventListener("click", ctrlDeleteItem);
    };

    updateBudget = function () {
        //calculate the budget
        budget.calculateBudget();
        //return the budget
        budgetvalues = budget.getBudget();
        //display the budget on the UI
        ui.displayBudget(budgetvalues);
    };
    updatepercentages = function () {
        // 1. calculate precentage
        budget.calculatePrecentages();
        //2. read precentage from the budget controller
        var precentages = budget.getPrecentage();
        //3. update the ui with the new precentages
        ui.displayPrecentages(precentages);
    };
    ctrlAddItem = function () {
        //get the field input data
        var input = ui.getInput();
        if (
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            //add the item to the budget cont
            var newItem = budgetController.addItem(
                input.type,
                input.description,
                input.value
            );

            //add the item to the UI
            ui.addLIstItem(newItem, input.type);
            //clearing field
            ui.clearFields();
            //calculate the budget and update the budget
            updateBudget();
            //calculate precentages and update it
            updatepercentages();
        }
    };
    var ctrlDeleteItem = function (event) {
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            id = parseInt(splitID[1]);
            // 1.delete the item from the data struc
            budgetController.deleteItem(type, id);

            //  2.delete the item from the ui
            ui.deleteListItem(itemID);

            // 3. update and show the new budget__title
            updateBudget();
            // 4. calculate precentages and update it
            updatepercentages();
        }
    };
    return {
        init: function () {
            setupEventLisenters();
            ui.displaydate();
            ui.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                precentage: 0,
            });
        },
    };
})(uiController, budgetController);

controller.init();
