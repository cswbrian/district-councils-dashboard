import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
// import VoterTurnoutChart from './VoterTurnoutChart'
import WaffleChart from 'components/atoms/charts/WaffleChart'
import { useTranslation } from 'react-i18next'

// TODO: change this to dcd data
const QUERY_FETCH_VOTES = gql`
  query($year: Int!, $code: String!) {
    dc_constituencies(where: { year: { _eq: $year }, code: { _eq: $code } }) {
      candidates_aggregate {
        aggregate {
          sum {
            votes
          }
        }
      }
      candidates {
        votes
        person {
          name_zh
          name_en
        }
      }
      vote_stat {
        total_votes
        total_voters
        total_voted_voters
        population_excluded_foreign_worker
        population_excluded_foreign_worker_lte_age_15
        population_excluded_foreign_worker_lte_age_20
      }
      station_stats {
        station_code
        name_en
        name_zh
        votes {
          votes
          age
          gender
        }
      }
    }
  }
`
const Container = styled.div`
   {
    padding: 0px 15px 100px 25px;
  }
`

const getDataForWaffleChart = (voteStat, candidates) => {
  const { t } = useTranslation()
  const {
    total_votes,
    total_voters,
    total_voted_voters,
    population_excluded_foreign_worker,
    population_excluded_foreign_worker_lte_age_15,
    // population_excluded_foreign_worker_lte_age_20
  } = voteStat

  // check first the data
  // TODO: the data should be good enough to remove this checking
  if (
    population_excluded_foreign_worker_lte_age_15 < total_voters ||
    total_voters === 0 ||
    total_voted_voters === 0
  ) {
    return []
  }

  const voteStats = [
    {
      // name: '不能投票',
      name: t('voteStats.text1'),
      // population: population_excluded_foreign_worker - population_excluded_foreign_worker_lte_age_15,
      population: population_excluded_foreign_worker - total_voters,
    },
    {
      // name: '沒有投票',
      name: t('voteStats.text2'),
      population:
        population_excluded_foreign_worker_lte_age_15 - total_voted_voters,
      // total_votes - total_voted_voters = registered but didn't vote?
    },
    {
      // name: '投票失效',
      name: t('voteStats.text3'),
      population: total_voted_voters - total_votes,
      // total_votes - total_voted_voters = registered but didn't vote?
    },
  ]

  candidates.forEach(({ votes, person: { name_zh, name_en } }) => {
    voteStats.push({
      // name: `投給 ${name_zh || name_en}`,
      name: `${t('voteStats.text4')} ${name_zh || name_en}`,
      population: votes,
      // total_votes - total_voted_voters = registered but didn't vote?
    })
  })

  return voteStats
}

class MainAreas extends Component {
  static propTypes = {
    year: PropTypes.number.isRequired,
    code: PropTypes.string.isRequired,
    district: PropTypes.object.isRequired,
  }

  render() {
    const { year, code } = this.props
    const { t } = useTranslation()
    return (
      <Query
        query={QUERY_FETCH_VOTES}
        variables={{ year: parseInt(year, 10), code }}
      >
        {({ loading, error, data }) => {
          if (loading) return null
          if (error) return `Error! ${error}`
          const { candidates, vote_stat } = data.dc_constituencies[0]

          let voteStats = []
          if (vote_stat) {
            voteStats = getDataForWaffleChart(vote_stat, candidates)
          }

          const stats = data.dc_constituencies[0].station_stats
          const barVote = { data: {} }
          barVote.total = stats.reduce((acc, cur) => {
            const sub_total = cur.votes.reduce((acc, cur) => {
              if (typeof barVote.data[cur.age] === 'undefined') {
                barVote.data[cur.age] = {}
              }
              if (typeof barVote.data[cur.age][cur.gender] === 'undefined') {
                barVote.data[cur.age][cur.gender] = 0
              }
              barVote.data[cur.age][cur.gender] += cur.votes
              return acc + cur.votes
            }, 0)
            return acc + sub_total
          }, 0)
          return (
            <Container>
              <Typography variant="h4">
                {/* 人口資料 */}
                {t('metrics.text1')}
              </Typography>
              {/* <VoterTurnoutChart
                id={`${year}_${code}_voter_turnout`}
                data={barVote}
              /> */}
              {voteStats.length > 0 ? (
                <WaffleChart
                  id={`${year}_${code}_voter_treemap`}
                  data={voteStats}
                />
              ) : (
                ''
              )}
            </Container>
          )
        }}
      </Query>
    )
  }
}

export default MainAreas
