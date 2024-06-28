<template>
  <q-layout
    view="lhh Lpr lff"
    container
    style="min-height: 100vh"
    class="shadow-2"
  >
    <q-header elevated style="height: 54px">
      <q-toolbar>
        <q-toolbar-title> </q-toolbar-title>
        <div class="select-wrapper">
          <q-select
            outlined
            v-model="courseSelect"
            :options="courses"
            label="Outlined"
            option-value="value"
            :option-label="item => item.name"
            @update:model-value="handleCourseChange"
          />
          <q-select
            outlined
            v-model="yearSelect"
            :options="years"
            label="Outlined"
            @update:model-value="handleYearChange"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="!drawer || miniState"
      @click.capture="drawerClick"
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: '0' }">
        <q-item clickable v-ripple class="app-title">
          <q-item-section avatar>
            <div class="relative-position">
            <div v-if="rank > 3 && showRankIcon" :class="['rank-background', 'rank-' + rank]"></div>
            <img v-if="rank > 3 && showRankIcon" :src="'/img/rank' + rank + '.png'" width="32px" style="z-index: 2; position: relative" alt="">
            <img v-else src="~assets/edgar.png" width="22" />
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              class="tooltip-rank-wrapper"
              :offset="[10, 10]"
            >
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 1}">Junior 1</p>
                <div>
                  <div :class="['rank-background', 'rank-1']"></div>
                  <img src="~assets/rank1.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 2}">Junior 2</p>
                <div>
                  <div :class="['rank-background', 'rank-2']"></div>
                  <img src="~assets/rank2.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 3}">Junior 3</p>
                <div>
                  <div :class="['rank-background', 'rank-3']"></div>
                  <img src="~assets/rank3.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 4}">Mid 1</p>
                <div>
                  <div :class="['rank-background', 'rank-4']"></div>
                  <img src="~assets/rank4.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 5}">Mid 2</p>
                <div>
                  <div :class="['rank-background', 'rank-5']"></div>
                  <img src="~assets/rank5.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 6}">Senior</p>
                <div>
                  <div :class="['rank-background', 'rank-6']"></div>
                  <img src="~assets/rank6.png" width="24" />
                </div>
              </div>
              <div class="tooltip-rank">
                <p :class="{'bold' : rank == 7}">Lead</p>
                <div>
                  <div :class="['rank-background', 'rank-7']"></div>
                  <img src="~assets/rank7.png" width="24" />
                </div>
              </div>
            </q-tooltip>
            </div>
          </q-item-section>

          <q-item-section>
            <div class="title-wrapper">
              <p class="edgar-title">Edgar</p>
              <p class="sidenav-version">v2</p>
            </div>
          </q-item-section>
        </q-item>

        <q-list class="main-list">
          <q-item
            class="q-mini-drawer-hide"
            clickable
            v-ripple
            @click="miniState = true"
          >
            <q-item-section avatar>
              <q-icon name="chevron_left" />
            </q-item-section>
          </q-item>

          <hr class="dashed" />

          <router-link to="/exam/new">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>

              <q-item-section> New exam </q-item-section>
            </q-item>
          </router-link>

          <router-link to="/exam/list">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="history_edu" />
              </q-item-section>

              <q-item-section> Previous exams </q-item-section>
            </q-item>
          </router-link>

          <router-link to="/tickets">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="confirmation_number" />
              </q-item-section>

              <q-item-section> My tickets </q-item-section>
            </q-item>
          </router-link>

          <router-link to="/stats">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="query_stats" />
              </q-item-section>

              <q-item-section> My stats </q-item-section>
            </q-item>
          </router-link>

          <router-link to="/leaderboard">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="leaderboard" />
              </q-item-section>

              <q-item-section> Leaderboard </q-item-section>
            </q-item>
          </router-link>

          <router-link to="/teacher">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="summarize" />
              </q-item-section>

              <q-item-section> Teacher report </q-item-section>
            </q-item>
          </router-link>
        </q-list>

        <div class="footer">
          <q-list>
            <router-link to="/config">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>

                <q-item-section> Config </q-item-section>
              </q-item>
            </router-link>

            <q-item clickable class="user-info">
              <q-item-section avatar>
                <q-icon name="person" v-if="false" />
                <img
                  v-if="true"
                  src="https://edgar.fer.hr/images/faces/32cb9da85a04c32eb9b1cfdc14ac8590.jpg"
                />
              </q-item-section>

              <q-item-section>
                <div class="username-wrapper">
                  <p>Ante Vujčić</p>
                  <p class="role">Student</p>
                </div>
              </q-item-section>

              <q-menu anchor="center right" self="center left">
                <div class="logout-wrapper">
                  <q-btn color="negative">Logout</q-btn>
                </div>
              </q-menu>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view
        @rankToggle="showRankIconFn"
        :yearSelected="yearSelect"
        :courseSelected="courseSelect?.id"
        :config="updateConfigDto"
        :rank="rank"
      ></router-view>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';

const drawer = ref(false);
const miniState = ref(false);
const userCourseInfo = ref<{
  id_academic_year: number,
  id_course: number,
  id_student: number,
  course_name: string,
  ects_credits: number,
  course_acronym: string
}[]>([])
const courseSelect = ref<{
  name: string,
  id: number}>();
const yearSelect = ref('2023/2024');
const years = ref(['2020/2021', '2021/2022', '2022/2023', '2023/2024']);
const courses = ref<{id: number, name: string}[]>([]);
const rank = ref<number>(-1)
const showRankIcon = ref<boolean>(false)

const mapUserInfo = () => {
  courses.value = Array.from(new Set(userCourseInfo.value.map(e => e.id_course)))
    .map(id => {
      const course = userCourseInfo.value.find(e => e.id_course === id);
      return { id: course?.id_course ?? 0, name: course?.course_name ?? '' };
    });

  courseSelect.value = courses.value[0]
  handleCourseChange(courseSelect.value)
}

const fetchStudentCourseInfo = (studentId: number) => {
  axios.get(`/api/courses?studentId=${studentId}`)
    .then(response => {
      userCourseInfo.value = response.data
      mapUserInfo()
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const showRankIconFn = (val: boolean) => {
  showRankIcon.value = val
}

fetchStudentCourseInfo(7726)

const handleCourseChange = (value: {id: number, name: string}) => {
  courseSelect.value = value;
  let availableYears: string[] = []
  userCourseInfo.value.forEach(e => {
    if(e.id_course == value.id) availableYears.push(e.id_academic_year + '/' + (Number(e.id_academic_year)+1))
  })
  years.value = availableYears
  yearSelect.value = years.value[0]
}

const handleYearChange = (value: string) => {
  yearSelect.value = value;
}

const drawerClick = (e: Event) => {
  if (miniState.value) {
    miniState.value = false;
    e.stopPropagation();
  }
};

let updateConfigDto = {
  font_family: 0,
  font_size: 16,
  contrast: false,
  custom_cursor: false,
  dark_cursor: false,
  rank_theme: false,
  rank_shadows: false,
  rank_icon: false,
};



interface AllRanksInterface {
  id_student: number,
  first_name: string,
  last_name: string,
  rank: string,
  percent_rank: number
  score: number
  attendedtests: number
}

const rankNames = ['Junior 1', 'Junior 2', 'Junior 3', 'Mid 1', 'Mid 2', 'Senior', 'Lead'];
const rankPercentages = [15, 15, 15, 20, 20, 13, 2];

const allStudents = ref()
const studentsByRank = ref<AllRanksInterface[][]>([])

const assignRank = (students: AllRanksInterface[]) => {
  studentsByRank.value = []
  const reversedArray = students.reverse()

  const ranks: AllRanksInterface[][] = [];

  let startIndex = 0;
  for (let i = 0; i < rankNames.length; i++) {
    const numStudentsPerRank = Math.ceil(students.length * (rankPercentages[i] / 100));

    const endIndex = Math.min(startIndex + numStudentsPerRank, students.length);

    ranks.push(reversedArray.slice(startIndex, endIndex).map(student => ({
      ...student,
      rank_icon: i+1
    })));

    startIndex = endIndex;
  }

  studentsByRank.value = ranks;

  allStudents.value = ranks.flat().reverse();

  rank.value = allStudents.value.find((e:{id: number, name: string, rank_icon: number }) => e.id == 7726)?.rank_icon
}

const fetchAlLRanks = () => {
  const academicYear = Number(yearSelect.value.split('/')[0])
  const courseId = Number(courseSelect.value?.id) || 0
  axios.get(`/api/analytics/all-ranks?academicYear=${academicYear}&courseId=${courseId}`)
    .then(response => {
      allStudents.value = response.data.map((e: AllRanksInterface) => {
        return {
          id: e.id_student,
          name: e.first_name + ' ' + e.last_name,
          rank: e.rank,
          percentRank: e.percent_rank.toFixed(4),
          score: e.score,
          attendedtests: e.attendedtests,
          rank_icon: e.rank
        }
      })
      assignRank(allStudents.value)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  fetchAlLRanks()
}

onMounted(fetchData)

watchEffect(() => fetchData())

</script>
