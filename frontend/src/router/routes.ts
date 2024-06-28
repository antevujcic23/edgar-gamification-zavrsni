import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'exam/new',
        component: () => import('src/pages/exam/ExamNew.vue'),
      },
      {
        path: 'exam/list',
        component: () => import('src/pages/exam/ExamList.vue'),
      },
      {
        path: 'exam/:id',
        component: () => import('src/pages/exam/ExamInfo.vue'),
        props: true,
      },
      {
        path: 'tickets',
        component: () => import('src/pages/tickets/TicketList.vue'),
      },
      {
        path: 'stats',
        component: () => import('src/pages/stats/StatsInfo.vue'),
      },
      {
        path: 'leaderboard',
        component: () => import('src/pages/leaderboard/LeaderboardInfo.vue'),
      },
      {
        path: 'teacher',
        component: () => import('src/pages/teacher/TeacherReports.vue'),
      },
      {
        path: 'config',
        component: () => import('src/pages/config/ConfigInfo.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/exam/ExamList.vue'),
  },
];

export default routes;
