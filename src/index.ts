import {
    Plugin,
    showMessage,
    Dialog,
    getFrontend,
    IModel,
} from "siyuan";
import "@/index.scss";
import { addContextMenuEvent, removeContextMenuEvent} from "@/icon/event";
import { Log} from "@/utils/log";
import { initSettingItems} from "@/icon/data";
import { dataStore} from "@/utils/store";


import SettingExample from "@/setting/setting.svelte";

const STORAGE_NAME = "menu-config";

export default class PluginSample extends Plugin {

    customTab: () => IModel;
    private isMobile: boolean;

    async onload() {
        Log.i("onload");
        dataStore.set(this.i18n);
        addContextMenuEvent();
        this.data[STORAGE_NAME] = { readonlyText: "Readonly" };
        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        this.addTopBar({
            icon: '<svg t="1716219469431" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5137" width="200" height="200"><path d="M403.2 780.8V619.2h-160c-89.6 0-161.6 72-161.6 161.6s72 161.6 161.6 161.6 160-72 160-161.6z m81.6 0c0 134.4-108.8 243.2-243.2 243.2S0 915.2 0 780.8s108.8-243.2 243.2-243.2h243.2c-1.6 0-1.6 243.2-1.6 243.2z m134.4 0V619.2h161.6c89.6 0 161.6 72 161.6 161.6s-72 161.6-161.6 161.6-161.6-72-161.6-161.6z m-81.6 0c0 134.4 108.8 243.2 243.2 243.2S1024 915.2 1024 780.8s-108.8-243.2-243.2-243.2H537.6v243.2z m-134.4-537.6v161.6h-160c-89.6 0-161.6-72-161.6-161.6S153.6 81.6 243.2 81.6s160 72 160 161.6z m81.6 0C484.8 108.8 376 0 243.2 0 108.8 1.6 0 108.8 0 243.2s108.8 243.2 243.2 243.2h243.2c-1.6 0-1.6-243.2-1.6-243.2z m134.4 0v161.6h161.6c89.6 0 161.6-72 161.6-161.6S870.4 81.6 780.8 81.6 619.2 153.6 619.2 243.2z m-81.6 0C537.6 108.8 646.4 0 780.8 0c134.4 1.6 241.6 108.8 241.6 243.2s-108.8 243.2-243.2 243.2H537.6v-81.6-161.6z" fill="" p-id="5138"></path></svg>',
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                this.openSetting();
            }
        });
        setTimeout(() => {
            initSettingItems();
        }, 300);
    }

    async onunload() {
        Log.d("onunload");
        showMessage(this.i18n.unloadInfo);
        removeContextMenuEvent();
    }

    uninstall() {
        Log.d("uninstall");
    }

    /**
     * A custom setting pannel provided by svelte
     */
    openSetting(): void {
        Log.d("openSetting");
        let dialog = new Dialog({
            title: this.i18n.settingTitle,
            content: `<div id="SettingPanel" style="height: 100%;"”></div>`,
            width: "800px",
            height: "600px",
            destroyCallback: (options) => {
                Log.d("destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                pannel.$destroy();
            }
        });
        let pannel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
        });
    }
}
