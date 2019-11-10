import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import { QUERY_GET_NOMINATION_SUMMARY } from 'queries/gql'
import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { DefaultLink } from 'components/atoms/Link'
import Columns, { SeperatedColumns } from 'components/atoms/Columns'
import { getConstituencyTagsByCandidateCamps, withLanguage } from 'utils/helper'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useTranslation } from 'react-i18next'

const Container = styled(Box)`
  && {
    width: 100%;
    padding: 0 0px;
    box-shadow: none;
  }
`

const FlexLink = styled(DefaultLink)`
  && {
    font-size: 14px;
    margin-right: 8px;
  }
`
const SummaryExpansionPanel = styled(ExpansionPanel)`
  && {
    box-shadow: none;
  }
`

const SummaryExpansionPanelSummary = styled(ExpansionPanelSummary)`
  && {
  }
`

const SummaryExpansionPanelDetails = styled(ExpansionPanelDetails)`
  && {
    padding: 0 24px;
  }
`

function ControlledExpansionPanels(props) {
  const [expanded, setExpanded] = React.useState(false)
  const { t } = useTranslation()

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  const { demo_clash, estab_clash, highlight } = props.tagsData // auto_win, highlight

  return (
    <div>
      <SummaryExpansionPanel
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <SummaryExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography variant="h5" gutterBottom>
            {/* 撞區 - {demo_clash.length + estab_clash.length}區 */}
            {t('summary.tag.highlight', { n: highlight.length })}
          </Typography>
        </SummaryExpansionPanelSummary>
        <SummaryExpansionPanelDetails>
          <Columns>
            <Typography variant="h6" gutterBottom>
              {t('summary.tag.highlight_text')}
            </Typography>
            {highlight.map((district, index) => (
              <FlexLink
                key={index}
                onClick={() =>
                  props.history.push(`district/2019/${district.code}`)
                }
              >
                {withLanguage(district.name_en, district.name_zh)}
              </FlexLink>
            ))}
          </Columns>
        </SummaryExpansionPanelDetails>
      </SummaryExpansionPanel>
      <SummaryExpansionPanel
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <SummaryExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography variant="h5" gutterBottom>
            {t('summary.tag.clash', {
              n: demo_clash.length + estab_clash.length,
            })}
          </Typography>
        </SummaryExpansionPanelSummary>
        <SummaryExpansionPanelDetails style={{ flexDirection: 'column' }}>
          <SeperatedColumns>
            <Typography variant="h6" gutterBottom>
              {/* 民主派撞區 - {demo_clash.length}區 */}
              {t('summary.tag.demo_clash', { n: demo_clash.length })}
            </Typography>
          </SeperatedColumns>
          <Columns>
            {demo_clash.map((district, index) => (
              <FlexLink
                key={index}
                onClick={() =>
                  props.history.push(`district/2019/${district.code}`)
                }
              >
                {withLanguage(district.name_en, district.name_zh)}
              </FlexLink>
            ))}
          </Columns>

          <SeperatedColumns>
            <Typography variant="h6" gutterBottom>
              {/* 建制派撞區 - {estab_clash.length}區 */}
              {t('summary.tag.estab_clash', { n: estab_clash.length })}
            </Typography>
          </SeperatedColumns>
          <Columns>
            {estab_clash.map((district, index) => (
              <FlexLink
                key={index}
                onClick={() =>
                  props.history.push(`district/2019/${district.code}`)
                }
              >
                {withLanguage(district.name_en, district.name_zh)}
              </FlexLink>
            ))}
          </Columns>
        </SummaryExpansionPanelDetails>
      </SummaryExpansionPanel>
      {/* <SummaryExpansionPanel
        expanded={expanded === 'panel3'}
        onChange={handleChange('panel3')}
      >
        <SummaryExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography variant="h5" gutterBottom>
            {t('summary.tag.uncontested', { n: auto_win.length })}
          </Typography>
        </SummaryExpansionPanelSummary>
        <SummaryExpansionPanelDetails>
          <Columns>
            {auto_win.map((district, index) => (
              <FlexLink
                key={index}
                onClick={() =>
                  props.history.push(`district/2019/${district.code}`)
                }
              >
                {`${district.name_zh}`}
              </FlexLink>
            ))}
          </Columns>
        </SummaryExpansionPanelDetails>
      </SummaryExpansionPanel> */}
    </div>
  )
}

const Summary = props => {
  return (
    <Query query={QUERY_GET_NOMINATION_SUMMARY}>
      {({ loading, error, data }) => {
        if (error) return `Error! ${error}`

        let result = []
        if (data && data.c2019) {
          data.c2019.forEach(dcca => {
            const tags = getConstituencyTagsByCandidateCamps(dcca.candidates)

            if (tags.length > 0) {
              result.push({
                ...dcca,
                tags,
              })
            }
          })
        }

        const demo_clash = result.filter(r => r.tags.includes('民主撞區'))
        const estab_clash = result.filter(r => r.tags.includes('建制撞區'))

        // const candi_5 = result.filter(r => r.tags.includes('多人混戰')).filter(district => district.candidates.length === 5)
        // const candi_4 = result.filter(r => r.tags.includes('多人混戰')).filter(district => district.candidates.length === 4)

        let auto_win = []
        let highlight = []
        if (data && data.c2015) {
          data.c2015.forEach(dcca2015 => {
            let dcca2019 = data.c2019.find(c => c.name_zh === dcca2015.name_zh)
            if (dcca2019) {
              const filteredCandidates2019 = dcca2019.candidates.filter(
                c =>
                  c.election_type === 'ordinary' &&
                  c.nominate_status === 'confirmed' &&
                  c.tags.findIndex(
                    tag => tag.type === 'demo_status' && tag.tag === 'planb'
                  ) === -1
              )
              if (dcca2015.candidates.length <= 1) {
                auto_win.push(dcca2019)
                if (filteredCandidates2019.length > 2) highlight.push(dcca2019)
              } else {
                var votes = dcca2015.candidates
                  .map(c => c.votes)
                  .sort((a, b) => b - a)
                var allVotes = votes.reduce((a, b) => a + b, 0)
                var votesDiffFrac = (votes[0] - votes[1]) / allVotes
                if (votesDiffFrac < 0.1) {
                  // Check if 2019 has 3 and more candidates
                  if (filteredCandidates2019.length > 2)
                    highlight.push(dcca2019)
                }
              }
            }
          })
        }

        const tagsData = {
          demo_clash: demo_clash,
          estab_clash: estab_clash,
          auto_win: auto_win,
          highlight: highlight,
        }

        return (
          <>
            {result && result.length > 0 && (
              <Container>
                <ControlledExpansionPanels
                  history={props.history}
                  tagsData={tagsData}
                />
                {/* <Typography variant="h6" gutterBottom>
                  2019年區議會選舉將於11月24日舉行，屆時將選出香港18區區議會共
                  <b>{data.dcd_constituencies.length}</b>個民選議席。
                </Typography> */}

                {/* <Typography variant="h6" gutterBottom>
                  5人混戰 - {candi_5.length}區
                </Typography>
                <Columns>
                  {candi_5.map((district, index) => (
                    <FlexLink
                      key={index}
                      onClick={() =>
                        props.history.push(
                          `district/2019/${district.code}`
                        )
                      }
                    >
                      { withLanguage(district.name_en, district.name_zh) }
                    </FlexLink>
                  ))}
                </Columns> */}

                {/* <Typography variant="h6" gutterBottom>
                  4人混戰 - {candi_4.length}區
                </Typography>
                <Columns>
                  {candi_4.map((district, index) => (
                    <FlexLink
                      key={index}
                      onClick={() =>
                        props.history.push(
                          `district/2019/${district.code}`
                        )
                      }
                    >
                      { withLanguage(district.name_en, district.name_zh) }
                    </FlexLink>
                  ))}
                </Columns> */}
              </Container>
            )}
          </>
        )
      }}
    </Query>
  )
}

export default withRouter(Summary)
