import React, { Component } from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { UnstyledButton } from 'components/atoms/Button'
import { Tag } from 'components/atoms/Tag'
import DistrictNewVoterChartContainer from 'components/containers/DistrictNewVoterChartContainer'
import Columns, { SeperatedColumns } from 'components/atoms/Columns'
import Rows from 'components/atoms/Rows'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import {
  getDistrictListUriFromTag,
  formatNumber,
  withLanguage,
} from 'utils/helper'
import { withRouter } from 'react-router-dom'
import { SuccessText, FailureText } from 'components/atoms/Text'
import { withTranslation } from 'react-i18next'

const Container = styled(Paper)`
  && {
    width: 100%;
    padding: 0 16px;
    box-shadow: none;
  }
`

const TagContainer = styled(Box)`
  && {
    margin-top: 6px;
    margin-right: 8px;
  }
`

class DCCAOverview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showGraph: false,
    }
  }

  renderPrevElectionButton(year) {
    return year > 1999 ? (
      <IconButton aria-label="arrow_back" onClick={this.props.onPrevElection}>
        <ArrowBackIcon />
      </IconButton>
    ) : (
      // if there is no next button, show a 48x48 empty box to align the 2 elements on the right
      <div style={{ width: '48px', height: '48px' }}></div>
    )
  }

  renderNextElectionButton(year) {
    const nextElectionYear = year + 4
    const currentYear = new Date().getFullYear()
    return nextElectionYear <= currentYear ? (
      <IconButton
        aria-label="arrow_forward"
        onClick={this.props.onNextElection}
      >
        <ArrowForwardIcon />
      </IconButton>
    ) : (
      // if there is no next button, show a 48x48 empty box to align the 2 elements on the left
      <div style={{ width: '48px', height: '48px' }}></div>
    )
  }

  toggleGraph() {
    this.setState({
      showGraph: !this.state.showGraph,
    })
  }

  render() {
    const {
      code,
      tags,
      voterData,
      description_zh,
      description_en,
      t,
    } = this.props
    const sortedTags = tags.sort((a, b) =>
      a.type === 'boundary' ? -1 : a.type === b.type ? 0 : 1
    )
    const new_voters_percentage = (
      (100 * voterData.aggregations.new_voters) /
      (voterData.aggregations.all_voters - voterData.aggregations.new_voters)
    ).toFixed(2)

    return (
      <>
        <Container>
          <SeperatedColumns>
            <Typography variant="h6">
              {withLanguage(description_en, description_zh) || ''}
            </Typography>
          </SeperatedColumns>
          <SeperatedColumns>
            <Rows>
              <UnstyledButton onClick={this.toggleGraph.bind(this)}>
                <Typography variant="h6">
                  {/* 選民人數 */}
                  {t('numberOfElectors')}{' '}
                  {formatNumber(voterData.aggregations.all_voters)} {' ('}
                  {new_voters_percentage > 0 ? (
                    <SuccessText display="inline">
                      +{new_voters_percentage}%
                    </SuccessText>
                  ) : (
                    <FailureText display="inline">
                      -{new_voters_percentage}%
                    </FailureText>
                  )}
                  )
                </Typography>
                {this.state.showGraph ? (
                  <KeyboardArrowUp fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </UnstyledButton>
              {this.state.showGraph && (
                <DistrictNewVoterChartContainer code={code} />
              )}
            </Rows>
          </SeperatedColumns>
          <Columns>
            {sortedTags.map((tag, index) => (
              <TagContainer key={index}>
                <Tag
                  value={tag.tag}
                  handleClick={() => {
                    this.props.history.push(getDistrictListUriFromTag(tag.tag))
                  }}
                />
              </TagContainer>
            ))}
          </Columns>
        </Container>
      </>
    )
  }
}

export default withRouter(withTranslation()(DCCAOverview))
