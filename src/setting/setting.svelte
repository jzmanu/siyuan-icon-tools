<script lang="ts">
    import SettingPanel from "../libs/setting-panel.svelte";
    import {refreshData,settingItems} from "@/icon/data"
    import {dataStore} from "@/utils/store"
    let groups: string[] = ["分组","关于"];
    let focusGroup = groups[0];
    let i18n = null;
    $: dataStore.subscribe(value => {
        i18n = value;
        groups = [i18n.group,i18n.about];
    });

    /********** Events **********/
    interface ChangeEvent {
        group: string;
        key: string;
        value: any;
    }

    const onChanged = ({ detail }: CustomEvent<ChangeEvent>) => {
        console.log("setting > onChanged > key:"+detail.key+",value:"+detail.value);
        refreshData(detail.key,detail.value);
        if (detail.group === groups[0]) {
            // setting.set(detail.key, detail.value);
            //Please add your code here
            //Udpate the plugins setting data, don't forget to call plugin.save() for data persistence
        }
    };
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
        {#each groups as group}
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
                data-name="editor"
                class:b3-list-item--focus={group === focusGroup}
                class="b3-list-item"
                on:click={() => {
                    focusGroup = group;
                }}
                on:keydown={() => {}}
            >
                <span class="b3-list-item__text">{group}</span>
            </li>
        {/each}
    </ul>
    <div class="config__tab-wrap">
        <SettingPanel
            group={groups[0]}
            settingItems={settingItems}
            display={focusGroup === groups[0]}
            on:changed={onChanged}
            on:click={({ detail }) => { console.debug("Click:", detail.key); }}
        >
            <div class="fn__flex b3-label">{i18n.usage}</div>
        </SettingPanel>
    </div>
</div>

<style lang="scss">
    .config__panel {
        height: 100%;
    }
    .config__panel > ul > li {
        padding-left: 1rem;
    }
</style>

