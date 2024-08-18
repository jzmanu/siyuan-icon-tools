import { getUnicode } from "./data"
import { Log } from "../utils/log"


function getDockByType(type) {
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

function unicode2Emoji(unicode, className = "", needSpan = false, lazy = false) {
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

function updateFileTreeEmoji(unicode, id, icon = "iconFile") {
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

/**
 * add contexmenu event listener1
 */
export function addContextMenuEvent() {
    Log.d("addContextMenuEvent")
    document.addEventListener('contextmenu', refreshTitleIcon)
}

export function removeContextMenuEvent() {
    Log.d("removeContextMenuEvent")
    document.removeEventListener('contextmenu', refreshTitleIcon)
}

/**
 * refresh title picture
 * @param {*} event 
 * @param {*} element 
 * @returns 
 */
async function refreshTitleIcon(event, element) {
    Log.d("refreshTitleIcon")
    let target = event.target
    if (element) {
        target = element
    }
    if (target.tagName == 'svg' || target.tagName == 'use') {
        Log.d("refreshTitleIcon return")
        return
    }
    Log.d("refreshTitleIcon > target > value："+target.classList.value)
    if (target.classList.value == "protyle-background__icon") {
        let dataNodeId = target.parentElement.parentElement.attributes["data-node-id"]
        let blockId = dataNodeId.nodeValue
        Log.d("refreshTitleIcon > blockId:" + blockId)
        syncFileTreeAndOutline(blockId);
    } else if (target.attributes.src != null) {
        Log.d("refreshTitleIcon > src is null.")
        let srcValue = target.attributes.src.nodeValue
        Log.d("refreshTitleIcon > target > srcValue:"+srcValue)
        if (srcValue != null && srcValue.indexOf("/emojis") > -1) {
            let blockId = target.parentElement.parentElement.parentElement.attributes["data-node-id"].nodeValue
            Log.d("refreshTitleIcon > custom emojis > blockId:" + blockId)
            syncFileTreeAndOutline(blockId);
        }
    } else {
        Log.w("refreshTitleIcon > don't suuport.")
    }
}


function syncFileTreeAndOutline(blockId) {
    Log.d("syncFileTreeAndOutline > blockId:" + blockId)
    let iconUnicode = getUnicode();
    Log.d("syncFileTreeAndOutline > iconUnicode:" + iconUnicode)
    window.siyuan.config.editor.emoji.unshift(iconUnicode);
    if (window.siyuan.config.editor.emoji.length > 64) {
        window.siyuan.config.editor.emoji.pop();
    }
    window.siyuan.config.editor.emoji = Array.from(new Set(window.siyuan.config.editor.emoji));
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
        body: JSON.stringify({ emoji: window.siyuan.config.editor.emoji })
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
    setOutlintIcon(emoji);
}

function setOutlintIcon(emoji) {
    let tar = document.querySelector(".b3-list-item__graphic");
    let parent = tar.parentElement;
    Log.d("setOutlintIcon > parent:"+parent);
    if (parent == null) {
        Log.e("setOutlintIcon > parent is null.");
        return;
    }
    let firstChild = parent.childNodes[0];
    if(firstChild.tagName == 'IMG'){
        firstChild.remove();
        const span = document.createElement('span');
        span.classList.add('b3-list-item__graphic');
        const child = parent.firstChild;
        if (child) {
            parent.insertBefore(span, child);
        }
    }
    let outline = document.querySelector(".b3-list-item__graphic");
    Log.d("setOutlintIcon > emoji:"+emoji+",outline:"+outline);
    if (outline != null) {
        outline.textContent = emoji;
    }
}