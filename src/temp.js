(() => { 
    /**
     * get random picture url
     * @returns random picture url
     */
    async function getRandomPictureUrl() {
        let request = await fetch('/snippets/assets/backgrounds/')
        let tempDom = new DOMParser().parseFromString(await request.text(), "text/html")
        let imageUrlArray = tempDom.querySelectorAll('a')
        let randomUrl = imageUrlArray[Math.floor(Math.random() * imageUrlArray.length)].getAttribute("href")
        let url = "/snippets/assets/backgrounds/" + randomUrl
        console.log("getRandomPictureUrl > url:" + url)
        return url
    }

    function getDockByType(type){
        if (!window.siyuan.layout.leftDock) {
            return undefined;
        }
        if (window.siyuan.layout.leftDock.data[type]) {
            return window.siyuan.layout.leftDock;
        }
        if (window.siyuan.layout.rightDock.data[type]) {
            return window.siyuan.layout.rightDock;
        }
        if (window.siyuan.layout.bottomDock.data[type]) {
            return window.siyuan.layout.bottomDock;
        }
    };

    function unicode2Emoji (unicode, className = "", needSpan = false, lazy = false){
        if (!unicode) {
            return "";
        }
        let emoji = "";
        if (unicode.indexOf(".") > -1) {
            emoji = `<img class="${className}" ${lazy ? "data-" : ""}src="/emojis/${unicode}"/>`;
        } else {
            try {
                unicode.split("-").forEach(item => {
                    if (item.length < 5) {
                        emoji += String.fromCodePoint(parseInt("0" + item, 16));
                    } else {
                        emoji += String.fromCodePoint(parseInt(item, 16));
                    }
                });
                if (needSpan) {
                    emoji = `<span class="${className}">${emoji}</span>`;
                }
            } catch (e) {
                // 自定义表情搜索报错 https://github.com/siyuan-note/siyuan/issues/5883
                // 这里忽略错误不做处理
            }
        }
        return emoji;
    };

    function updateFileTreeEmoji(unicode, id, icon = "iconFile"){
        let emojiElement;
        /// #if MOBILE
        emojiElement = document.querySelector(`#sidebar [data-type="sidebar-file"] [data-node-id="${id}"] .b3-list-item__icon`);
        /// #else
        const dockFile = getDockByType("file");
        if (dockFile) {
            const files = dockFile.data.file;
            if (icon === "iconFile") {
                emojiElement = files.element.querySelector(`[data-node-id="${id}"] .b3-list-item__icon`);
            } else {
                emojiElement = files.element.querySelector(`[data-node-id="${id}"] .b3-list-item__icon`) || files.element.querySelector(`[data-url="${id}"] .b3-list-item__icon`) || files.closeElement.querySelector(`[data-url="${id}"] .b3-list-item__icon`);
            }
        }
        /// #endif  b3-list-item__graphic
        if (emojiElement) {
            emojiElement.innerHTML = unicode2Emoji(unicode || (icon === "iconFile" ? (emojiElement.previousElementSibling.classList.contains("fn__hidden") ? Constants.SIYUAN_IMAGE_FILE : Constants.SIYUAN_IMAGE_FOLDER) : Constants.SIYUAN_IMAGE_NOTE));
        }
        if (icon !== "iconFile") {
            // setNoteBook();
        }
    };

    // add contexmenu event listener
    document.addEventListener('contextmenu', refreshTitlePicture)
    /**
     * refresh title picture
     * @param {*} event 
     * @param {*} element 
     * @returns 
     */
    async function refreshTitlePicture(event, element) {
        console.log("refreshTitlePicture")
        let target = event.target
        if (element) {
            target = element
        }
        if (target.tagName == 'svg' || target.tagName == 'use') {
            refreshTitlePicture(event, target.parentElement)
            console.log("refreshTitlePicture return")
            return
        }
        
        let blockId = target.parentElement.parentElement.attributes["data-node-id"].nodeValue
        console.log("refreshTitlePicture > blockId:" + blockId)
        console.log("refreshTitlePicture > target.classList.value=" + (target.classList.value))
       
        if (target.classList.value == "") {
            let url = await getRandomPictureUrl()
            target.parentElement.parentElement.querySelector('img').setAttribute("style", '')
            target.parentElement.parentElement.querySelector('img').setAttribute("src", url)

            fetch('/api/attr/setBlockAttrs', {
                method: 'post',
                body: JSON.stringify({
                    id: blockId,
                    attrs: { 'title-img': `background-image:url(${url})` }
                })
            }
            )
        } else if (target.classList.value == "protyle-background__icon") {
            var existingDiv = target.parentElement.parentElement.querySelector(".protyle-background__icon");
            const emoArr = window.siyuan.emojis;
            let food = emoArr.filter(item => {
                return item.id == "food";
            })
            let icons = food[0].items;
            console.log("refreshTitlePicture > existingDiv:"+existingDiv+',length:'+food.length+',icons:'+icons.length)
            let iconUnicode = icons[Math.floor(Math.random() * icons.length)].unicode
            console.log("refreshTitlePicture > iconUnicode:"+iconUnicode)
            window.siyuan.config.editor.emoji.unshift(iconUnicode);
            if (window.siyuan.config.editor.emoji.length > 64) {
                window.siyuan.config.editor.emoji.pop();
            }
            window.siyuan.config.editor.emoji = Array.from(new Set(window.siyuan.config.editor.emoji));
            // fetch("/api/setting/setEmoji", {'emoji': window.siyuan.config.editor.emoji});

            fetch('/api/attr/setBlockAttrs', {
                method: 'post',
                body: JSON.stringify({
                    id: blockId,
                    attrs: { 'icon': `${iconUnicode}` }
                })
            }
            )

            fetch('/api/setting/setEmoji', {
                method: 'post',
                body: JSON.stringify({emoji: window.siyuan.config.editor.emoji})
            }
            )
            updateFileTreeEmoji(iconUnicode, blockId);

            // update outline emoji
            let emoji = "";
            iconUnicode.split("-").forEach(item => {
                if (item.length < 5) {
                    emoji += String.fromCodePoint(parseInt("0" + item, 16));
                } else {
                    emoji += String.fromCodePoint(parseInt(item, 16));
                }
            });
            document.querySelector(".b3-list-item__graphic").textContent = emoji;
        }else{
            console.log("refreshTitlePicture > don't suuport.")
        }
    }
})()
