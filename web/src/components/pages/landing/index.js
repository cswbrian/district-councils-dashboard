import React, { Component } from 'react'
import { Query } from 'react-apollo'
import Summary from 'components/templates/Summary'
import CampCompareChartContainer from 'components/templates/CampCompareChartContainer'
import Countdown from 'components/atoms/Countdown'
import styled from 'styled-components'
import { Typography, Fab } from '@material-ui/core'
import { ThumbUpAlt } from '@material-ui/icons'

import { Alert } from 'components/atoms/Alert'
import SearchTab from 'components/organisms/SearchTab'
import { QUERY_GET_CONFIG } from 'queries/gql'
import { COLORS } from 'ui/theme'
import { UnstyledNavLink } from 'components/atoms/Link'

const Container = styled.div`
  width: 100%;
  padding: 16px;
  margin: auto;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  flex-grow: 1;
`

const TopSection = styled(Container)`
  && {
    background-color: #f2f2f3;
  }
`

const StyledCampCompareChartContainer = styled(CampCompareChartContainer)`
  && {
    margin-top: 16px;
  }
`
const CountdownContainer = styled.div`
  && {
    width: 100%;
  }
`

const StyledSearchTab = styled(SearchTab)`
  && {
    padding: 100px;
  }
`
const ConfigCenterText = styled.div`
  && {
    width: 100%;
    text-align: center;
    a {
      text-decoration: none;
      color: ${COLORS.main.primary};
    }
  }
`

const SupportUsButton = styled(Fab)`
  && {
    z-index: 9999;
    right: 16px;
    bottom: 16px;
    position: absolute;
    padding: 100px;
    font-size: 14px;
    padding: 0 16px !important;
  }
`

const ThumbIcon = styled(ThumbUpAlt)`
  && {
    font-size: large;
    margin-right: 4px;
  }
`

const electionDate = 'Nov 24, 2019 07:30:00'
class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      autoCompleteList: [],
    }
  }

  async componentDidMount() {}
  onTabSelected(type) {}

  renderAlert = () => {
    return (
      <Query query={QUERY_GET_CONFIG} variables={{ key: 'landing_alert' }}>
        {({ loading, error, data }) => {
          if (loading || error) return null
          return data.dcd_config[0] ? (
            <Alert>
              <Typography variant="h6" gutterBottom>
                {data.dcd_config[0].value.text}
              </Typography>
            </Alert>
          ) : (
            <></>
          )
        }}
      </Query>
    )
  }

  renderCenterText = () => {
    return (
      <Query
        query={QUERY_GET_CONFIG}
        variables={{ key: 'landing_center_text' }}
      >
        {({ loading, error, data }) => {
          if (loading || error) return null
          return data.dcd_config[0] ? (
            <ConfigCenterText variant="h6" gutterBottom>
              <div
                dangerouslySetInnerHTML={{
                  __html: data.dcd_config[0].value.html_text,
                }}
              />
            </ConfigCenterText>
          ) : (
            <></>
          )
        }}
      </Query>
    )
  }

  render() {
    return (
      <>
        <UnstyledNavLink to={`/support-us`}>
          <SupportUsButton
            size="small"
            color="secondary"
            variant="extended"
            aria-label="add"
          >
            <ThumbIcon />
            支持我們
          </SupportUsButton>
        </UnstyledNavLink>
        {this.renderAlert()}
        <TopSection>
          {Date.parse(new Date(electionDate)) > Date.parse(new Date()) && (
            <CountdownContainer>
              <Typography
                variant="h5"
                style={{ textAlign: 'center' }}
                gutterBottom
              >
                距離投票日
              </Typography>
              <Countdown date={electionDate} />
            </CountdownContainer>
          )}
          {/* <LandingIcon /> */}
        </TopSection>
        <Container>
          <Summary />
          {this.renderCenterText()}
          <StyledSearchTab />
          <StyledCampCompareChartContainer />
        </Container>
      </>
    )
  }
}

export default IndexPage
