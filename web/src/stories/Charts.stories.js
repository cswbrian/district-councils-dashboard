import React from 'react'
import DCPredictionChartPanel from 'components/organisms/PredictionChartPanel'
import DCStackedNormalizedHorizontalBarChart from 'components/atoms/charts/StackedNormalizedHorizontalBarChart'
import { Columns } from 'components/atoms/Columns'

export default { title: 'Charts' }

const CampCompareChartData = {
  columns: ['name', '建制', '其他', '非建制'],
  data: [
    {
      name: '灣仔',
      建制: 11,
      非建制: 1,
      其他: 1,
      total: 13,
    },
    {
      name: '油尖旺',
      建制: 16,
      非建制: 3,
      其他: 0,
      total: 19,
    },
    {
      name: '九龍城',
      建制: 20,
      非建制: 4,
      其他: 0,
      total: 24,
    },
    {
      name: '離島',
      建制: 8,
      非建制: 2,
      其他: 0,
      total: 10,
    },
    {
      name: '元朗',
      建制: 27,
      非建制: 3,
      其他: 5,
      total: 35,
    },
    {
      name: '觀塘',
      建制: 28,
      非建制: 5,
      其他: 4,
      total: 37,
    },
    {
      name: '中西區',
      建制: 11,
      非建制: 4,
      其他: 0,
      total: 15,
    },
    {
      name: '荃灣',
      建制: 13,
      非建制: 4,
      其他: 1,
      total: 18,
    },
    {
      name: '屯門',
      建制: 20,
      非建制: 8,
      其他: 1,
      total: 29,
    },
    {
      name: '北區',
      建制: 12,
      非建制: 4,
      其他: 2,
      total: 18,
    },
    {
      name: '東區',
      建制: 23,
      非建制: 8,
      其他: 4,
      total: 35,
    },
    {
      name: '大埔',
      建制: 12,
      非建制: 6,
      其他: 1,
      total: 19,
    },
    {
      name: '南區',
      建制: 10,
      非建制: 4,
      其他: 3,
      total: 17,
    },
    {
      name: '葵青',
      建制: 17,
      非建制: 9,
      其他: 3,
      total: 29,
    },
    {
      name: '黃大仙',
      建制: 13,
      非建制: 7,
      其他: 5,
      total: 25,
    },
    {
      name: '西貢',
      建制: 14,
      非建制: 7,
      其他: 6,
      total: 27,
    },
    {
      name: '深水埗',
      建制: 11,
      非建制: 11,
      其他: 1,
      total: 23,
    },
    {
      name: '沙田',
      建制: 17,
      非建制: 17,
      其他: 4,
      total: 38,
    },
  ],
}

export const StackedNormalizedHorizontalBarChart = props => {
  return (
    <DCStackedNormalizedHorizontalBarChart
      data={CampCompareChartData}
    ></DCStackedNormalizedHorizontalBarChart>
  )
}

export const PredictionChartPanel = props => {
  const [settings, setSettings] = React.useState({
    config: {
      auto_won_add_components: false,
      reference_last_election: true,
    },
    camp_rate: [0, 0, 0],
    vote_rate: [0, 0, 0],
  })
  return (
    <DCPredictionChartPanel
      settings={settings}
      setSettings={setSettings}
    ></DCPredictionChartPanel>
  )
}
