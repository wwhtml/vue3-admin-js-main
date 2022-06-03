<template>
  <div>
    <a-modal
      ref="modalRef"
      v-model:visible="visible"
      :wrap-style="{ overflow: 'hidden' }"
      :okText="okText"
      :cancelText="cancelText"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <slot></slot>
      <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move">
          {{ title }}
        </div>
      </template>

      <template #modalRender="{ originVNode }">
        <div :style="transformStyle">
          <component :is="originVNode" />
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import {  ref, computed, watch, watchEffect } from "vue";
import { useDraggable } from "@vueuse/core";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: "ok1",
    },
    cancelText: {
      type: String,
      default: "cancel1",
    },
    title: {
      type: String,
      default: "title1",
    },
  },
  emits: ["update:visible", "ok", "cancel"],

  setup(props, context) {
    const handleOk = (e) => {
      // context.emit("update:visible", false);
      context.emit("ok", e);
    };
    const handleCancel = (e) => {
      context.emit("update:visible", false);
      context.emit("cancel", e);
    };

    const modalTitleRef = ref(null);
    const { x, y, isDragging } = useDraggable(modalTitleRef);

    const startX = ref(0);
    const startY = ref(0);
    const startedDrag = ref(false);
    const transformX = ref(0);
    const transformY = ref(0);
    const preTransformX = ref(0);
    const preTransformY = ref(0);
    const dragRect = ref({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    });
    watch([x, y], () => {
      if (!startedDrag.value) {
        startX.value = x.value;
        startY.value = y.value;
        const bodyRect = document.body.getBoundingClientRect();
        const titleRect = modalTitleRef.value.getBoundingClientRect();
        dragRect.value.right = bodyRect.width - titleRect.width;
        dragRect.value.bottom = bodyRect.height - titleRect.height;
        preTransformX.value = transformX.value;
        preTransformY.value = transformY.value;
      }

      startedDrag.value = true;
    });
    watch(isDragging, () => {
      if (!isDragging) {
        startedDrag.value = false;
      }
    });
    watchEffect(() => {
      if (startedDrag.value) {
        transformX.value =
          preTransformX.value +
          Math.min(
            Math.max(dragRect.value.left, x.value),
            dragRect.value.right
          ) -
          startX.value;
        transformY.value =
          preTransformY.value +
          Math.min(
            Math.max(dragRect.value.top, y.value),
            dragRect.value.bottom
          ) -
          startY.value;
      }
    });
    const transformStyle = computed(() => {
      return {
        transform: `translate(${transformX.value}px, ${transformY.value}px)`,
      };
    });
    return {
      handleOk,
      handleCancel,
      modalTitleRef,
      transformStyle,
    };
  },
};
</script>
