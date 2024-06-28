<template>
  <div class="list-wrapper">
    <div class="card-wrapper">
      <div class="settings-category">
        <h4>Font</h4>
        <div class="settings-option-wrapper font-section">
          <q-select
            v-model="fontModel"
            :options="fonts"
            @update:model-value="handleFontChange(fontModel)"
            label="Select font"
          />
          <q-slider
            v-model="fontSize"
            :min="12"
            :max="20"
            :step="1"
            label
            :label-value="fontSize + 'px'"
            label-always
            color="primary"
            @change="handleFontSizeChange(fontSize)"
          />
          <div class="toggle-wrapper">
            <q-toggle
              v-model="contrast"
              label="Contrast"
              @update:model-value="toggleContrast(contrast)"
            />
          </div>
        </div>
      </div>
      <div class="settings-category">
        <h4>Cursor</h4>
        <div class="settings-option-wrapper">
          <div class="toggle-wrapper">
            <q-toggle
              v-model="customCursor"
              label="Custom"
              @update:model-value="toggleCustomCursor(customCursor)"
            />
          </div>
          <div class="toggle-wrapper" v-if="customCursor">
            <q-toggle
              v-model="darkCursor"
              label="Dark"
              @update:model-value="toggleDarkCursor(darkCursor)"
            />
          </div>
        </div>
      </div>
      <div class="settings-category">
        <h4>Theme</h4>
        <div class="settings-option-wrapper">
          <q-toggle
            v-model="rankTheme"
            label="Rank theme"
            @update:model-value="toggleRankTheme(rankTheme)"
          />
          <q-toggle
            v-model="rankShadow"
            label="Rank shadows"
            @update:model-value="toggleRankShadow(rankShadow)"
          />
          <q-toggle
            v-model="showRankIcon"
            label="Show rank icon"
            @update:model-value="toggleShowRankIcon(showRankIcon)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup props="props">
import { ref, onMounted, defineEmits, watchEffect, watch } from 'vue';
import { setCssVar } from 'quasar';
import axios from 'axios';

const props = defineProps({
  rank: Number
});

const emit = defineEmits(['rankToggle']);
const fontSize = ref(16);

onMounted(() => {
  const computedFontSize = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('font-size'),
    10
  );
  fontSize.value = !isNaN(computedFontSize) ? computedFontSize : 16;
});

const setFontChange = (selectedFont: string) => {
  setCssVar('theme-font-family', selectedFont);
}

const handleFontChange = (selectedFont: string) => {
  setFontChange(selectedFont)
  updateConfig()
};

const setFontSize = (fontSize: number) => {
  document.documentElement.style.fontSize = fontSize + 'px';
  setCssVar('theme-font-size', fontSize + 'px');
}

const handleFontSizeChange = (fontSize: number) => {
  setFontSize(fontSize);
  updateConfig()
};

const setContrast = (val: boolean) => {
  val
    ? document.documentElement.classList.add('font-contrast')
    : document.documentElement.classList.remove('font-contrast');
}
const toggleContrast = (val: boolean) => {
  setContrast(val)
  updateConfig()
};

const setDarkCursor = (val: boolean) => {
  val
    ? document.documentElement.classList.add('dark-cursor')
    : document.documentElement.classList.remove('dark-cursor');
}
const toggleDarkCursor = (val: boolean) => {
  setDarkCursor(val)
  updateConfig()
};

const setCustomCursor = (val: boolean) => {
  val
    ? document.documentElement.classList.add('custom-cursor')
    : document.documentElement.classList.remove('custom-cursor');
}
const toggleCustomCursor = (val: boolean) => {
  setCustomCursor(val)
  updateConfig()
};

const setRankTheme = (val: boolean) => {
  const rankColor = getComputedStyle(document.body).getPropertyValue('--rank-color-' + ((props?.rank ?? 0) ));
  val
    ? (
      setCssVar('primary', rankColor)
    )
    : (
      setCssVar('primary', '#00819c')
    )
}
const toggleRankTheme = (val: boolean) => {
  setRankTheme(val)
  updateConfig()
};

const setRankShadow = (val: boolean) => {
  val
    ? (
      document.documentElement.classList.add('toggle-card-shadow')
    )
    : (
      document.documentElement.classList.remove('toggle-card-shadow')
    )
}
const toggleRankShadow = (val: boolean) => {
  setRankShadow(val)
  updateConfig()
};

const emitRankIcon = (val: boolean) => {
  emit('rankToggle', val)
}
const toggleShowRankIcon = (val: boolean) => {
  emitRankIcon(val)
  updateConfig()
};

const fontModel = ref('Roboto');
const customCursor = ref(false);
const darkCursor = ref(false);
const rankTheme = ref(false);
const rankShadow = ref(false);
const showRankIcon = ref(false);
const fonts = [
  'Abhaya Libre',
  'Lato',
  'Lexend',
  'Merriweather',
  'Montserrat',
  'Mulish',
  'OpenDyslexic',
  'Roboto',
];
const contrast = ref(false);


const updateConfig = () => {
  const studentId = 7726;
  const updateConfigDto = {
    font_family: fonts.indexOf(fontModel.value),
    font_size: fontSize.value,
    contrast: contrast.value,
    custom_cursor: customCursor.value,
    dark_cursor: darkCursor.value,
    rank_theme: rankTheme.value,
    rank_shadows: rankShadow.value,
    rank_icon: showRankIcon.value,
  };
  axios.patch(`/api/configs?studentId=${studentId}`, updateConfigDto).then(
    response => {
      fontModel.value = fonts[response.data[0].font_family];
      fontSize.value = response.data[0].font_size;
      contrast.value = response.data[0].contrast;
      customCursor.value = response.data[0].custom_cursor;
      darkCursor.value = response.data[0].dark_cursor;
      rankTheme.value = response.data[0].rank_theme;
      rankShadow.value = response.data[0].rank_shadows;
      showRankIcon.value = response.data[0].rank_icon;
    }
  );

}

const getConfig = () => {
  const studentId = 7726
  axios.get(`/api/configs?studentId=${studentId}`)
    .then(response => {
      fontModel.value = fonts[response.data[0].font_family];
      fontSize.value = response.data[0].font_size;
      contrast.value = response.data[0].contrast;
      customCursor.value = response.data[0].custom_cursor;
      darkCursor.value = response.data[0].dark_cursor;
      rankTheme.value = response.data[0].rank_theme;
      rankShadow.value = response.data[0].rank_shadows;
      showRankIcon.value = response.data[0].rank_icon;

      emitRankIcon(showRankIcon.value)
      setRankShadow(rankShadow.value)
      setRankTheme(rankTheme.value)
      setDarkCursor(darkCursor.value)
      setCustomCursor(customCursor.value)
      setContrast(contrast.value)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  getConfig()
}

onMounted(fetchData)

watchEffect(() => fetchData())

watch(() => props.rank, () => {
  if (rankTheme.value) {
    setRankTheme(rankTheme.value);
  }
});
</script>

