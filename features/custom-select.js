const customSelectVersion = '1.6';
window.customSelectVersion = customSelectVersion;
window.customSelectModuleLoaded = true;
function collapseSelectItems(items) {
    if (!items || !items.style.maxHeight) return;
    items.style.maxHeight = null;
    items.style.opacity = '0';
    const prevSibling = items.previousElementSibling;
    if (prevSibling) {
        prevSibling.classList.remove('active');
    }
    setTimeout(() => items.classList.add('hidden'), 300);
}
function closeSelectItems(items) {
    if (!items) return;
    if (items._openTimer) {
        clearTimeout(items._openTimer);
        items._openTimer = null;
    }
    if (items._hideTimer) {
        clearTimeout(items._hideTimer);
        items._hideTimer = null;
    }
    items.style.maxHeight = null;
    items.style.opacity = '0';
    const prevSibling = items.previousElementSibling;
    if (prevSibling) {
        prevSibling.classList.remove('active');
    }
    items._hideTimer = setTimeout(() => {
        items._hideTimer = null;
        items.classList.add('hidden');
    }, 300);
}
function closeAllSelectItems(except) {
    document.querySelectorAll('.select-items').forEach(items => {
        if (items === except) return;
        if (items.style.maxHeight) {
            collapseSelectItems(items);
        } else if (!items.classList.contains('hidden')) {
            closeSelectItems(items);
        }
    });
}
function expandSelectItems(selectItems, selectSelected) {
    let maxZIndex = 20;
    document.querySelectorAll('.select-items').forEach(item => {
        const zIndex = parseInt(item.style.zIndex) || 20;
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
        }
    });
    selectItems.style.zIndex = maxZIndex + 1;
    selectItems.classList.remove('hidden');
    selectSelected.classList.add('active');
    if (selectItems._hideTimer) {
        clearTimeout(selectItems._hideTimer);
        selectItems._hideTimer = null;
    }
    if (selectItems._openTimer) {
        clearTimeout(selectItems._openTimer);
        selectItems._openTimer = null;
    }
    selectItems._openTimer = setTimeout(() => {
        selectItems._openTimer = null;
        selectItems.style.maxHeight = "200px";
        selectItems.style.opacity = '1';
    }, 10);
}
function isSelectOpen(selectItems) {
    return !!selectItems.style.maxHeight && !selectItems.classList.contains('hidden');
}
function clearSelectKeyboardActive(selectItems) {
    selectItems.querySelectorAll('.select-item.keyboard-active').forEach(function (item) {
        item.classList.remove('keyboard-active');
    });
}
function prepareSelectKeyboard(customSelect) {
    const selectSelected = customSelect.querySelector('.select-selected');
    const selectItems = customSelect.querySelector('.select-items');
    const selectOptions = Array.prototype.slice.call(customSelect.querySelectorAll('.select-item'));
    if (!selectSelected || !selectItems || !selectOptions.length) return;
    if (selectSelected.dataset.selectKeyboard === 'true') return;
    selectSelected.dataset.selectKeyboard = 'true';
    selectSelected.tabIndex = 0;
    selectSelected.setAttribute('role', 'button');
    selectSelected.setAttribute('aria-haspopup', 'listbox');
    selectSelected.setAttribute('aria-expanded', 'false');
    let activeIndex = -1;
    const setExpanded = function (value) {
        selectSelected.setAttribute('aria-expanded', value ? 'true' : 'false');
    };
    const highlight = function (index) {
        if (index < 0 || index >= selectOptions.length) return;
        clearSelectKeyboardActive(selectItems);
        activeIndex = index;
        selectOptions[index].classList.add('keyboard-active');
        selectOptions[index].scrollIntoView({ block: 'nearest' });
    };
    const reset = function () {
        activeIndex = -1;
        clearSelectKeyboardActive(selectItems);
        setExpanded(false);
    };
    const open = function () {
        if (!isSelectOpen(selectItems)) selectSelected.click();
        setExpanded(true);
        activeIndex = selectOptions.findIndex(function (option) {
            return option.classList.contains('selected');
        });
        highlight(activeIndex < 0 ? 0 : activeIndex);
    };
    const close = function () {
        if (isSelectOpen(selectItems)) selectSelected.click();
        reset();
    };
    selectSelected.addEventListener('pointerdown', function () {
        selectSelected.focus();
    });
    selectSelected.addEventListener('click', function () {
        setTimeout(function () {
            const open = isSelectOpen(selectItems);
            setExpanded(open);
            if (!open) activeIndex = -1;
        }, 20);
    });
    selectSelected.addEventListener('keydown', function (event) {
        const key = event.key;
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ', 'Escape', 'Tab'].indexOf(key) === -1) return;
        if (key === 'Tab') {
            reset();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (key === 'Escape') {
            close();
            return;
        }
        if (key === 'Enter' || key === ' ') {
            if (isSelectOpen(selectItems) && activeIndex >= 0) {
                selectOptions[activeIndex].click();
                selectItems.style.maxHeight = null;
                selectItems.style.opacity = '0';
                selectItems.classList.add('hidden');
                reset();
                selectSelected.focus();
            } else {
                open();
            }
            return;
        }
        if (!isSelectOpen(selectItems)) open();
        if (key === 'Home') highlight(0);
        else if (key === 'End') highlight(selectOptions.length - 1);
        else if (key === 'ArrowDown') highlight(activeIndex < 0 ? 0 : (activeIndex + 1) % selectOptions.length);
        else if (key === 'ArrowUp') highlight(activeIndex <= 0 ? selectOptions.length - 1 : activeIndex - 1);
    });
    selectSelected.addEventListener('blur', function () {
        reset();
    });
}
let selectKeyboardObserver = null;
function observeDynamicSelects() {
    if (selectKeyboardObserver || !window.MutationObserver) return;
    selectKeyboardObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (!node || node.nodeType !== 1) return;
                if (node.classList && node.classList.contains('custom-select')) prepareSelectKeyboard(node);
                if (node.querySelectorAll) node.querySelectorAll('.custom-select').forEach(prepareSelectKeyboard);
            });
        });
    });
    selectKeyboardObserver.observe(document.body, { childList: true, subtree: true });
}
function initCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(customSelect => {
        prepareSelectKeyboard(customSelect);
        if (customSelect.dataset.i18nSelect || customSelect.dataset.customSelectBound) return;
        customSelect.dataset.customSelectBound = 'true';
        const selectedValue = customSelect.querySelector('.select-selected span');
        const selectItems = customSelect.querySelector('.select-items');
        const selectOptions = customSelect.querySelectorAll('.select-item');
        let nativeSelect;
        if (customSelect.parentElement.querySelector('#theme-toggle')) {
            nativeSelect = customSelect.parentElement.querySelector('#theme-toggle');
            const savedTheme = localStorage.getItem('2048-setting-theme') || 'auto';
            nativeSelect.value = savedTheme;
        } else if (customSelect.parentElement.querySelector('#language-select')) {
            nativeSelect = customSelect.parentElement.querySelector('#language-select');
        } else {
            nativeSelect = customSelect.querySelector('select') || customSelect.parentElement.querySelector('select');
            if (nativeSelect && nativeSelect.id === 'custom-theme-palette-select') {
                nativeSelect.value = localStorage.getItem('2048-setting-custom-theme-palette') || 'auto';
            }
        }
        if (selectedValue && nativeSelect) {
            const currentValue = nativeSelect.value;
            selectOptions.forEach(option => {
                if (option.getAttribute('data-value') === currentValue) {
                    selectedValue.innerHTML = option.innerHTML;
                }
            });
        }
        selectOptions.forEach(option => {
            if (nativeSelect && option.getAttribute('data-value') === nativeSelect.value) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        selectItems.classList.add('hidden');
        selectItems.style.maxHeight = null;
        selectItems.style.opacity = '0';
        customSelect.addEventListener('click', function(e) {
            const selectSelected = this.querySelector('.select-selected');
            if (selectItems.style.maxHeight) {
                collapseSelectItems(selectItems);
            } else {
                closeAllSelectItems(selectItems);
                expandSelectItems(selectItems, selectSelected);
            }
        });
        selectOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const iconEl = this.querySelector('i');
                const emojiEl = this.querySelector('.emoji-icon');
                const iconHTML = iconEl ? iconEl.outerHTML : '';
                const emojiHTML = emojiEl ? emojiEl.outerHTML : '';
                const text = this.cloneNode(true);
                const iconInClone = text.querySelector('i');
                const emojiInClone = text.querySelector('.emoji-icon');
                if (iconInClone) iconInClone.remove();
                if (emojiInClone) emojiInClone.remove();
                const textContent = text.textContent.trim();
                if (selectedValue) {
                    const selectedIcon = selectedValue.querySelector('i') || selectedValue.querySelector('.emoji-icon');
                    if (selectedIcon) {
                        selectedIcon.remove();
                    }
                    if (iconHTML) {
                        selectedValue.innerHTML = iconHTML + ' ' + textContent;
                    } else if (emojiHTML) {
                        selectedValue.innerHTML = emojiHTML + ' ' + textContent;
                    } else {
                        selectedValue.textContent = textContent;
                    }
                }
                if (nativeSelect) {
                    nativeSelect.value = value;
                    nativeSelect.dispatchEvent(new Event('change'));
                }
                selectOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectItems.classList.add('hidden');
            });
        });
        if (nativeSelect) {
            nativeSelect.addEventListener('change', function() {
                const currentValue = this.value;
                selectOptions.forEach(option => {
                    if (option.getAttribute('data-value') === currentValue) {
                        selectedValue.innerHTML = option.innerHTML;
                    }
                });
            });
        }
    });
    document.addEventListener('click', function() {
        document.querySelectorAll('.select-items').forEach(collapseSelectItems);
    });
    observeDynamicSelects();
}
document.addEventListener('click', function (event) {
    const target = event.target;
    const selected = target && target.closest ? target.closest('.select-selected') : null;
    if (!selected) return;
    const wrapper = selected.closest('.custom-select');
    closeAllSelectItems(wrapper ? wrapper.querySelector('.select-items') : null);
}, true);
window.customSelect = {
    version: customSelectVersion,
    init: initCustomSelects,
    domMode: 'none',
    isDomReady: function () { return true; },
    closeAll: closeAllSelectItems,
    close: closeSelectItems,
    expand: expandSelectItems,
    collapse: collapseSelectItems
};