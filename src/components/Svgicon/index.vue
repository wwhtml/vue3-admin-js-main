<template>
    <svg class="svg-class" :class="className">
        <use :href="'#icon-' + iconName"></use>
    </svg>
</template>
<script>
export default {
    name: "SvgIcon",
    props: {
        iconName: {//svg图标的名称
            type: String,
            default: "www"
        },
        className: {//给图片添加的类名，用来设置样式
            type: String,
            default: ""
        }
    }
}
</script>