'use strict';

(function() {

    window.onload = function() {
        let form,
            formSelectsSelected = false;

        form = document.getElementById('form');

        form.addEventListener('submit', submitForm);

        ajaxRequest();
        
        function ajaxRequest() {
            let xhr,
                data,
                url = 'js/data.json';

            xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    data = JSON.parse(xhr.response);
                    fillSelects(data);
                }
            };
            xhr.send();
        }

        function fillSelects(data) {
            let select,
                option,
                categoryName,
                categoryData,
                currentCategory,
                customSelect;

            customSelect = document.querySelectorAll('.custom-select');

            for (let key in data) {
                categoryName = key;
                select = document.createElement('select');
                select.setAttribute('name', categoryName);
                select.setAttribute('class', 'select');
                for (let i = 0; i < data[categoryName].length; i++) {
                    categoryData = data[categoryName];
                    if (i === 0) {
                        switch(categoryName) {
                            case 'cars': {
                                createOption(select, option, 0, 'Марка автомобиля');
                                break;
                            }
                            case 'years': {
                                createOption(select, option, 0, 'Год выпуска');
                                break;
                            }
                            case 'engine': {
                                createOption(select, option, 0, 'Объем двигателя');
                                break;
                            }
                        }
                    }
                    createOption(select, option, categoryData[i].value, categoryData[i].title);
                }

                currentCategory = Object.keys(data);
                for (let i = 0; i < currentCategory.length;i++) {
                    if (currentCategory[i] == categoryName) {
                        customSelect[i].appendChild(select);
                        break;
                    }
                }
            }

            function createOption(select, option, value, title) {
                option = document.createElement('option');
                option.setAttribute('value', value);
                option.innerHTML = title;
                select.appendChild(option);
            }

            customSelectInit();
        }

        function customSelectInit() {
            let blockClass,
                select,
                customSelect,
                customCurrentOption,
                customOptionsList,
                customOption,
                cars = 0;

            blockClass = 'custom-select';
            /* Look for any elements with the class 'custom-select': */
            customSelect = document.getElementsByClassName(blockClass);
            for (let i = 0; i < customSelect.length; i++) {
                select = customSelect[i].getElementsByTagName('select')[0];
                /* For each element, create a new DIV that will act as the selected item: */
                customCurrentOption = document.createElement('DIV');
                customCurrentOption.setAttribute('class', blockClass + '__current-option ' + blockClass +'__current-option_default');
                customCurrentOption.innerHTML = select.options[select.selectedIndex].innerHTML;
                customSelect[i].appendChild(customCurrentOption);
                /* For each element, create a new ul that will contain the option list: */
                customOptionsList = document.createElement('ul');
                customOptionsList.setAttribute('class', blockClass + '__options-list');
                for (let i = 1; i < select.length; i++) {
                    /* For each option in the original select element,
                    create a new li that will act as an option item: */
                    customOption = document.createElement('li');
                    customOption.setAttribute('class', blockClass + '__option');
                    customOption.innerHTML = select.options[i].innerHTML;
                    customOption.addEventListener('click', function(e) {
                        /* When an item is clicked, update the original select box,
                        and the selected item: */
                        let select,
                            customCurrentOption,
                            customSelectedOption;

                        select = this.parentNode.parentNode.getElementsByTagName('select')[0];
                        customCurrentOption = this.parentNode.previousSibling;
                        for (let i = 0; i < select.length; i++) {
                            if (select.options[i].innerHTML == this.innerHTML) {
                                select.selectedIndex = i;
                                customCurrentOption.innerHTML = this.innerHTML;
                                customCurrentOption.classList.remove(blockClass + '__current-option_default');
                                customSelectedOption = this.parentNode.getElementsByClassName(blockClass + '__option_selected');
                                for (let i = 0; i < customSelectedOption.length; i++) {
                                    customSelectedOption[i].classList.toggle(blockClass + '__option_selected');
                                }
                                //this.setAttribute('class', blockClass + '__option_selected');
                                this.classList.toggle(blockClass + '__option_selected');
                                break;
                            }
                        }
                        if (!formSelectsSelected) {
                            checkSelectedOptions();
                        }
                        customCurrentOption.click();
                    });
                    customOptionsList.appendChild(customOption);
                }
                customSelect[i].appendChild(customOptionsList);
                customCurrentOption.addEventListener('click', function(e) {
                    /* When the select box is clicked, close any other select boxes,
                    and open/close the current select box: */
                    e.stopPropagation();
                    closeAllSelect(this);
                    this.nextSibling.classList.toggle(blockClass + '__options-list_opened');
                    this.classList.toggle(blockClass + '__current-option_active');
                });
            }

            function closeAllSelect(elem) {
                /* A function that will close all select boxes in the document,
                except the current select box: */
                let customOptionsList,
                    customCurrentOption,
                    arrNo = [];

                customOptionsList = document.getElementsByClassName(blockClass + '__options-list');
                customCurrentOption = document.getElementsByClassName(blockClass + '__current-option');
                for (let i = 0; i < customCurrentOption.length; i++) {
                    if (elem == customCurrentOption[i]) {
                        arrNo.push(i)
                    } else {
                        customCurrentOption[i].classList.remove(blockClass + '__current-option_active');
                    }
                }
                for (let i = 0; i < customOptionsList.length; i++) {
                    if (arrNo.indexOf(i)) {
                        customOptionsList[i].classList.remove(blockClass + '__options-list_opened');
                    }
                }
            }

            /* If the user clicks anywhere outside the select box,
            then close all select boxes: */
            document.addEventListener('click', closeAllSelect);

        }

        function saveToLocalStorage() {
            let customSelect,
                select;

            customSelect = document.querySelectorAll('.custom-select');

            for (let i = 0; i < customSelect.length; i++) {
                select = document.getElementsByTagName('select');
                localStorage.setItem(select[i].name, select[i].value);
            }

            showResult();
        }

        function showResult() {
            let result,
                resultData;

            result = document.querySelector('.calculator__result');

            if(localStorage.length > 0) {
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        if (resultData) {
                            resultData += '&' + key + '=' + localStorage.getItem(key);
                        } else {
                            resultData = '' + key + '=' + localStorage.getItem(key);
                        }
                    }
                }

            }

            result.innerHTML = resultData;
        }

        function checkSelectedOptions() {
            let customSelect,
                select,
                hiddenContent;

            customSelect = document.querySelectorAll('.custom-select');

            for (let i = 0; i < customSelect.length; i++) {
                select = document.getElementsByTagName('select');
                if (+select[i].value !== 0) {
                    if (customSelect.length-1 === i) {
                        hiddenContent = document.querySelector('.calculator__hidden-content');
                        hiddenContent.removeAttribute("hidden");
                        formSelectsSelected = true;
                    }
                } else {
                    break;
                }
            }
        }

        function submitForm(event) {
            event.preventDefault();
            if (formSelectsSelected) {
                saveToLocalStorage();
            }
        }
    }
})();
