//module pattern, encapsulation, only expose public interface / api
//iife and closures
//private

//budget
var budgetController = (function () {

    //class/ctor
    var Expense = function (id, description, value) {
        this.id = id;
        this.descritpion = description;
        this.value = value;
        this.percentage = -1;
    };
    //extend object with how to calculate percentage from totalincome method
    Expense.prototype.calcPercentage = function (totalIncome) {
        //integer
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.descritpion = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        // callback function for each type in the array
        data.allItems[type].forEach(function (cur) {
            //previous sum + curent value
            //sum = sum + cur.value old version
            sum += cur.value
        });

        //store sum in Data.Totals object
        data.totals[type] = sum;
        /*
         initial value: 0
         [200, 400, 100]
         first iteration
         sum = 0 + 200
         next iteration
         sum = 200 + 400
         last iteration
         sum = 600 + 100 = 700
         */
    };

    //global data object 
    var data = {
        allItems: {
            exp: [],
            inc: [],
        },

        totals: {
            //properties
            exp: 0,
            inc: 0
        },
        budget: 0,
        //-1 = doesnt exist
        percentage: -1
    }

    return {
        //methods
        addItem: function (type, desc, val) {
            var newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            // create new item based on type
            if (type === "exp") {
                newItem = new Expense(ID, desc, val);
            } else if (type === "inc") {
                newItem = new Income(ID, desc, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            //return
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index, type;

            // pass id of 3
            //data.allItems[type][id];
            //[1 2 4 6 8]

            //loop through all the elements in inc or exc array
            //map receives a callback function which has access to current element in entire array
            //difference between foreach is that map returns a brand new array
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            //find index
            index = ids.indexOf(id);

            //BUG
            if (index !== -1) {
                //splice removes elements, slice creates and copies
                //first arg is position from which you want to delete, 2nd is the number of els to delete
                data.allItems[type].splice(index, 1);
                //results in: ids = [1 2 4   8]
            }

        },

        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");

            // calculate the budget: income - expenses
            //retrieve data from global storage, perform substraction and store it again in data.budget
            data.budget = data.totals.inc - data.totals.exp;


            // calculate the percentage of income
            // expense = 100 and income 200, spent 50% = 100/200 = 0.5 * 100

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        //calculate expense for each object in array
        calculatePercentages: function () {
            //requires callback function
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        //return and store it
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            //return all values (4). best way to do this with an object.
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        //NOT TO USE IN PRODUCTION. testing method exposes data to public.
        testing: function () {
            console.log(data);
        }
    };


})();

//ui
var UIController = (function () {

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputAdd: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        lblBudget: ".budget__value",
        lblIncome: ".budget__income--value",
        lblExpenses: ".budget__expenses--value",
        lblPercentage: ".budget__expenses--percentage",
        container: ".container",
        lblExpensesPerc: ".item__percentage",
        lblDate: ".budget__title--month"
    };

    //this private function will take in a number and a type. type will serve to differntiate between income and expense.
    var formatNumber = function (num, type) {
        var num, numSplit, int, dec;
        //negative or positive before a number, 2 decimal points, comma separating thousands
        //abs number, remove sign
        num = Math.abs(num);
        //puts exactly 2 decimal points
        num = num.toFixed(2);
        //divide number into 2 parts. integer then decimal
        numSplit = num.split(".");
        //store the split number in array
        int = numSplit[0];
        dec = numSplit[1];

        //adding , to numbers e.g. 2,300 or 23,000. rememeber 3 0's.
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
        }

        //return the string
        //if type is exp then sign should be -, else should be +
        return (type === "exp" ? sign = "-" : sign = "+") + " " + int + "." + dec;
    };

    // custom foreach function iterator
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {

        //GET INPUT
        getInput: function () {
            return {
                //read value
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                //JS parsefloat to convert string into number
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        //publicmethod
        addListItem: function (obj, type) {
            var html, newHtml, element, fields;
            //create HTML string with placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === "exp") {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //replace placeholder with actual data
            newHtml = html.replace("%id", obj.id);
            newHtml = newHtml.replace("%description%", obj.descritpion);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

            //insert the html into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);


        },

        deleteListItem: function (selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },


        //public method
        //clear list
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            //trick slice to think it's an array when it's a list

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            //focus on description (inputDescription)
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            //comes from the object we pass to the method
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.lblBudget).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.lblIncome).textContent = formatNumber(obj.totalIncome, "inc");
            document.querySelector(DOMstrings.lblExpenses).textContent = formatNumber(obj.totalExp, "exp");


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.lblPercentage).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.lblPercentage).textContent = "---";
            }

        },

        displayPercentages: function (percentages) {

            //returns an html node list
            var fields = document.querySelectorAll(DOMstrings.lblExpensesPerc);
            //loop through all the nodes selected, cant use .slice method hack to convert into an array, thus .foreach won't work

            //custom foreach custom in private iife
            //will get called as a callback property in the nodeListForEach function in every iteration
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + "%";
                } else {
                    current.textContent = "---";
                }
            });
        },

        displayMonth: function () {
            var now, year, month, months;
            //object ctor requires new keyword
            now = new Date();
            months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.lblDate).textContent = months[month] + ", " + year;

        },

        //method to change styles on dropdown click, this will return a node list. use custom foreach method i wrote.
        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType, + "," +
                DOMstrings.inputDescription + "," +
                DOMstrings.inputValue);


            //bug...doesn't seem to work in FF
            nodeListForEach(fields, function (cur) {
                //everytime class changes toggle the css
                cur.classList.toggle("red-focus");
            });

            document.querySelector(DOMstrings.inputAdd).classList.toggle("red");
        },

        //expose DOMstrings to public
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

//global
var appController = (function (budget, ui) {
    //exposed DOMstrings
    var listeners = function () {
        var DOM = UIController.getDOMstrings();
        document.querySelector(DOM.inputAdd).addEventListener("click", cAddItem);

        document.addEventListener("keypress", function (e) {

            //which = older browser compatibility
            if (e.keyCode === 13 || e.which === 13) {
                cAddItem();
            }

            //add event listener on click event, callback function
            document.querySelector(DOM.container).addEventListener("click", cDeleteItem);
            //event listener to change colours on changed dropdown selection
            document.querySelector(DOM.inputType).addEventListener("changed", UIController.changedType);
        });
    }


    var updateBudget = function () {
        // calculate budget
        budgetController.calculateBudget();

        // return budget to store in a variable
        var budget = budgetController.getBudget()

        // display budget
        UIController.displayBudget(budget);
        //console.log(budget);

    };

    var updatePercentages = function () {

        // calculate percentages
        budgetController.calculatePercentages();
        // read percentages from the budget controller
        var percentages = budgetController.getPercentages();
        //update the ui
        UIController.displayPercentages(percentages);

    };


    //DRY
    //creates object when pressing submitting input
    var cAddItem = function () {
        var input, newItem;
        // get input
        input = ui.getInput();

        //TODO: Ignore negatives 
        if (input.description !== "" && !isNaN(input.value && input.value > 0)) {
            //console.log(input);
            // add to budget
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // update ui
            UIController.addListItem(newItem, input.type);
            UIController.clearFields();

            // call updateBudget()
            updateBudget()
        }

        //calculate and update percentages
        updatePercentages();

    };

    var cDeleteItem = function (e) {
        var itemID, splitID, type, ID;
        //traverse DOM to the parent element
        itemID = e.target.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //split ids, returns an array
            splitID = itemID.split("-");
            //first element before -
            type = splitID[0];
            //after -
            //this returns a string. problem arises when passing id to delete item, thinks it's -1. solution: convert to number.
            ID = parseInt(splitID[1]);

            // delete item from the data structure
            budgetController.deleteItem(type, ID);

            //delete from UI, pass itemID as ID to delete
            UIController.deleteListItem(itemID)

            //update and show the new budget
            updateBudget();

        }
    };


    return {
        init: function () {
            console.log("app started.")
            UIController.displayMonth();
            UIController.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExp: 0,
                percentage: -1
            });
            listeners();
        }
    };

})(budgetController, UIController);

appController.init();
