<!--
 Copyright (c) 2023 by frostime All Rights Reserved.
 Author       : frostime
 Date         : 2023-07-01 19:23:50
 FilePath     : /src/libs/setting-panel.svelte
 LastEditTime : 2024-04-27 16:46:49
 Description  : 
-->
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import SettingItem from "./setting-item.svelte";

    export let group: string;
    export let settingItems: ISettingItem[];
    export let display: boolean = true;

    const dispatch = createEventDispatcher();

    function onClick( {detail}) {
        dispatch("click", { key: detail.key });
    }
    function onChanged( {detail}) {
        dispatch("changed", {group: group, ...detail});
    }

    $: fn__none = display ? "" : "fn__none";

</script>

<div class="config__tab-container {fn__none}" data-name={group}>
    <slot />
    {#each settingItems as item (item.key)}
        <SettingItem
            type={item.type}
            title={window.siyuan.config.lang == "zh_CN" ? item.title: item.key.charAt(0).toUpperCase() + item.key.slice(1)}
            description={item.description}
            settingKey={item.key}
            settingValue={item.value}
            placeholder={item?.placeholder}
            options={item?.options}
            slider={item?.slider}
            button={item?.button}
            on:click={onClick}
            on:changed={onChanged}
        />
    {/each}
</div>