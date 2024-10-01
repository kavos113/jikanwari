<script setup lang="ts">
import { CourseListItem, CourseDetail } from '../../../../types/course.js'
import { ref } from 'vue'
import CourseListCard from '@renderer/components/list/CourseListCard.vue'

const props = defineProps<{
  data: CourseListItem[]
}>()

const emits = defineEmits<{
  (event: 'getCourseDetail', id: int): void
}>()

const isDetail = ref<boolean>(false)

const timetable = ref<string[]>([])
props.data.forEach((item) => {
  const text = item.timetable
    .map((item) => {
      return `${item.day_of_week} ${item.period}限 ${item.room}`
    })
    .join('\n')
  timetable.value.push(text)
})

const openDetail = () => {
  emits('getCourseDetail', 1)
}

const sample: CourseDetail = {
  code: 'PHY.S209',
  title: '2024年度　熱力学（物理）(講義）',
  english_title: 'Thermodynamics (Physics) (Lecture)',
  lecturer: [
    {
      name: '笹本 智弘',
      url: 'https://www.ocw.titech.ac.jp/index.php?module=General&action=StaffInfo&id=489'
    }
  ],
  department: '物理学系',
  start: '2024年度 3Q',
  sylbs_update: '2024年3月29日',
  lecture_type: '講義 (対面型)',
  language: '日本語',
  detailsHTML:
    '<div id="overview">\n\n          <div class="cont-sec">\n            <h3>講義の概要とねらい</h3>\n            <p>熱力学は物質の状態や状態変化を理解するための基礎的学問である。本講義では，主に気体を対象として，熱力学の法則，エントロピー，自由エネルギー，平衡条件などの熱力学の基礎を講義する。<br>受講生は熱力学の法則やエントロピー，自由エネルギーなどの概念と，その数学的記述を修得し，これを基に熱力学現象を理解し，未知の熱力学問題を解明する能力を養う。</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>到達目標</h3>\n            <p>本講義を履修することにより，以下の知識と能力を修得する。<br>1) 熱力学の法則を理解できる。<br>2) エントロピー，自由エネルギー，化学ポテンシャルなどの概念を理解できる。<br>3) 熱力学の数学的記述法を修得し，式が意味する物理を説明できる。</p>\n          </div>\n\n\n          <div class="cont-sec"><h3>キーワード</h3><p style="white-space: pre-line;">内部エネルギー，熱力学第一法則，準静的過程，定積変化，定圧変化，等温変化，断熱変化，カルノーサイクル，熱力学第二法則，効率，熱力学温度，エントロピー，可逆と不可逆過程，平衡条件，自由エネルギー，マックスウェルの関係式，相平衡，化学ポテンシャル，空洞放射，ゴム弾性，磁性体</p></div>\n\n          <div class="cont-sec">\n            <h3>学生が身につける力(ディグリー・ポリシー)</h3>\n            <table id="learing_skill2" class="overview">\n              <tbody>\n              <tr>\n                <td class="skill_checked2" style="border-top-width: 0px">✔ <span style="color: #000">専門力</span></td>\n                <td class="skill_checked3" style="border-top-width: 0px"><span>教養力</span></td>\n                <td class="skill_checked3" style="border-top-width: 0px"><span>コミュニケーション力</span></td>\n                <td class="skill_checked3" style="border-top-width: 0px"><span>展開力(探究力又は設定力)</span></td>\n                <td class="skill_checked2" style="border-top-width: 0px">✔ <span style="color: #000">展開力(実践力又は解決力)</span></td>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n\n          <div class="cont-sec">\n            <h3>授業の進め方</h3>\n            <p>各講義の3/4は基礎的内容について，残る1/4は発展的応用的内容についての解説に充てる。講義内容の確実な理解と応用力を養うために，講義内容に関連した演習問題を演習で出題する。</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>授業計画・課題</h3>\n            <table id="lecture_plans" class="overview">\n              <thead>\n              <tr>\n                <th>&nbsp;</th>\n                <th>授業計画</th>\n                <th>課題</th>\n              </tr>\n              </thead>\n              <tbody>\n              <tr>\n                <td class="number_of_times">第1回</td>\n                <td class="plan">熱力学第一法則とカルノーサイクル</td>\n                <td class="assignment">熱力学第一法則を説明せよ。カルノーサイクルを説明せよ。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第2回</td>\n                <td class="plan">熱力学第二法則</td>\n                <td class="assignment">熱力学第二法則を説明せよ。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第3回</td>\n                <td class="plan">エントロピー</td>\n                <td class="assignment">エントロピーを説明せよ。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第4回</td>\n                <td class="plan">平衡条件と自由エネルギー</td>\n                <td class="assignment">自由エネルギーを用いて平衡条件を説明せよ。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第5回</td>\n                <td class="plan">熱力学諸関数</td>\n                <td class="assignment">マックウェルの関係式を導け。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第6回</td>\n                <td class="plan">相平衡と化学ポテンシャル</td>\n                <td class="assignment">相平衡を化学ポテンシャルを用いて説明せよ。</td>\n              </tr>\n              <tr>\n                <td class="number_of_times">第7回</td>\n                <td class="plan">熱力学の応用</td>\n                <td class="assignment">ゴム弾性と磁性体の性質を熱力学的に説明せよ。</td>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n\n          <div class="cont-sec">\n            <h3>授業時間外学修（予習・復習等）</h3>\n            <p>学修効果を上げるため，教科書や配布資料等の該当箇所を参照し，「毎授業」授業内容に関する予習と復習（課題含む）をそれぞれ概ね100分を目安に行うこと。</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>教科書</h3>\n            <p>特になし</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>参考書、講義資料等</h3>\n            <p>フェルミ"熱力学" 三省堂<br>田崎晴明 "熱力学" 培風館<br>など。講義中にも紹介する。</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>成績評価の基準及び方法</h3>\n            <p>到達度をレポート課題、期末試験により評価する。</p>\n          </div>\n\n          <div class="cont-sec">\n            <h3>関連する科目</h3>\n            <ul>\n              <li>PHY.S301 ： 統計力学(講義）</li>\n              <li>PHY.S312 ： 統計力学II(講義）</li>\n            </ul>\n          </div>\n\n          <div class="cont-sec">\n            <h3>履修の条件(知識・技能・履修済科目等)</h3>\n            <p>履修の条件は設けない。</p>\n          </div>\n\n\n\n        </div>',
  credits: 1,
  timetable: [
    {
      day_of_week: '火',
      period: 3,
      room: 'M-178(H1101)'
    },
    {
      day_of_week: '火',
      period: 4,
      room: 'M-178(H1101)'
    }
  ]
}
</script>

<template>
  <input id="courseDetail" v-model="isDetail" type="checkbox" />
  <label for="courseDetail">詳細表示</label>
  <div v-if="isDetail">
    <CourseListCard v-for="item in data" :key="item.code" :course="item" />
  </div>
  <div v-else>
    <table class="table">
      <thead>
        <tr>
          <th>コード</th>
          <th>講義名</th>
          <th>担当</th>
          <th>時間割</th>
          <th>開講学期</th>
          <th>開講</th>
          <th>単位数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in props.data" :key="item.code">
          <td class="openDetail" @click="openDetail">
            <p>{{ item.code }}</p>
          </td>
          <td class="openDetail" @click="openDetail">
            <p>{{ item.title }}</p>
          </td>
          <td>
            <a :href="item.lecturer[0].url">{{ item.lecturer[0].name }}</a>
          </td>
          <td>{{ timetable[i] }}</td>
          <td>{{ item.start }}</td>
          <td>{{ item.department }}</td>
          <td>{{ item.credits }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}

.table td {
  font-size: 12px;
  padding: 2px 8px;
}

.openDetail {
  cursor: pointer;
}

.openDetail p:hover {
  color: #42d392;
}
</style>
