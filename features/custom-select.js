const customSelectVersion = '1.0';
window.customSelectVersion = customSelectVersion;
(function() {
    try {
        window.customSelectModuleLoaded = true;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCustomSelects);
        } else {
            initCustomSelects();
        }
    } catch (error) {
        console.warn('Custom select module loading failed:', error);
        window.customSelectModuleLoaded = false;
    }
})();
function initCustomSelects() {
    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(customSelect => {
        if (customSelect.dataset.i18nSelect) return;
        const selectedValue = customSelect.querySelector('.select-selected span');
        const selectItems = customSelect.querySelector('.select-items');
        const selectOptions = customSelect.querySelectorAll('.select-item');
        let nativeSelect;
        if (customSelect.parentElement.querySelector('#theme-toggle')) {
            nativeSelect = customSelect.parentElement.querySelector('#theme-toggle');
        } else if (customSelect.parentElement.querySelector('#language-select')) {
            nativeSelect = customSelect.parentElement.querySelector('#language-select');
        }
        if (selectedValue && nativeSelect) {
            selectedValue.textContent = nativeSelect.options[nativeSelect.selectedIndex].text;
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
            e.stopPropagation();
            const selectSelected = this.querySelector('.select-selected');
            if (selectItems.style.maxHeight) {
                selectItems.style.maxHeight = null;
                selectItems.style.opacity = '0';
                selectSelected.classList.remove('active');
                setTimeout(() => selectItems.classList.add('hidden'), 300);
            } else {
                const allSelectItems = document.querySelectorAll('.select-items');
                let maxZIndex = 20;
                allSelectItems.forEach(item => {
                    const zIndex = parseInt(item.style.zIndex) || 20;
                    if (zIndex > maxZIndex) {
                        maxZIndex = zIndex;
                    }
                });
                selectItems.style.zIndex = maxZIndex + 1;
                selectItems.classList.remove('hidden');
                selectSelected.classList.add('active');
                setTimeout(() => {
                    selectItems.style.maxHeight = "200px";
                    selectItems.style.opacity = '1';
                }, 10);
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
                if (selectedValue && this.options && this.selectedIndex >= 0 && this.selectedIndex < this.options.length) {
                    selectedValue.textContent = this.options[this.selectedIndex].text;
                }
            });
        }
    });
    document.addEventListener('click', function() {
        document.querySelectorAll('.select-items').forEach(selectItems => {
            if (selectItems.style.maxHeight) {
                selectItems.style.maxHeight = null;
                selectItems.style.opacity = '0';
                const selectSelected = selectItems.previousElementSibling;
                if (selectSelected) {
                    selectSelected.classList.remove('active');
                }
                setTimeout(() => selectItems.classList.add('hidden'), 300);
            }
        });
    });
}