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

    let blockId = target.parentElement.parentElement.attributes["data-node-id"].nodeValue
    Log.d("refreshTitleIcon > blockId:" + blockId)
    Log.d("refreshTitleIcon > target.classList.value=" + (target.classList.value))

    if (target.classList.value == "protyle-background__icon") {
        let iconUnicode = getUnicode();
        Log.d("refreshTitleIcon > iconUnicode:" + iconUnicode)
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
        var outline = document.querySelector(".b3-list-item__graphic");
        Log.d("refreshTitleIcon > emoji:"+emoji+",outline:"+outline);
        if (outline != null) {
            outline.textContent = emoji;
        }
    } else {
        Log.w("refreshTitleIcon > don't suuport.")
    }
}