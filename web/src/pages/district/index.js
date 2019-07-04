import React, { Component } from 'react'
import { styled } from '@material-ui/styles';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import CustomizedProgressBars from '../../components/BorderLinearProgress'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import OLMap from '../../components/OLMap'
import gql from "graphql-tag";
import { Query } from "react-apollo";

const DistrictCard = styled(Paper)({
  background: '#f6f6f6',
  color: '#00000',
  height: 300
})

const GET_DISTRICTS = gql`
query ($year: Int!, $code:String!) {
  dc_constituencies(where: {year: {_eq: $year}, code: {_eq: $code}}) {
    name_zh
    name_en
    code
    deviation_percentage
    expected_population
    main_areas
    candidates {
      candidate_number
      person {
        name_zh
        name_en
      }
      vote_percentage
      votes
      is_won
    }
  }
}
`;

class DistrictPage extends Component {

  homeUrl = 'https://cswbrian.github.io/district-councils-dashboard/'

  shouldComponentUpdate(nextProps, nextState) {

    //  if (this.props.route.path === nextProps.route.path) return false;
    return true;
  }

  handleChangeDistrict = (year, code) => {
    if (!year || !code) return
    this.props.history.push(`/district/${year}/${code}`)
  }

  onPrevElection() {
    const { match: { params: { year, code } } } = this.props
    this.props.history.push(`/district/${parseInt(year, 10) - 4}/${code}`)
  }

  onNextElection() {
    const { match: { params: { year, code } } } = this.props
    this.props.history.push(`/district/${parseInt(year, 10) + 4}/${code}`)
  }

  render() {
    const { match: { params: { year, code } } } = this.props
    const nextElectionYear = parseInt(year, 10) + 4;
    const currentYear = new Date().getFullYear();

    return (
      <>

        <Box
          display="flex"
          flexWrap="wrap"
          alignContent="flex-start" >
          <Box
            width={{ sm: '100%', md: '960px' }}
            height={{ sm: '300px', md: '400px' }}
          >
            <OLMap
              year={year}
              code={code}
              changeDistrict={this.handleChangeDistrict}
            />
          </Box>
          <Query query={GET_DISTRICTS} variables={{ year, code }}>
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error! ${error}`;
              const district = data.dc_constituencies[0];

              return (
                <>
                  <Box p={1} width={{ sm: '100%', md: '400px' }}
                    height={{ sm: '300px', md: '400px' }}>
                    <DistrictCard >
                      <Box
                        p={1}
                        border={0}
                        color='primary.minor'>
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems='center'
                          justifyContent='space-between'>
                          <IconButton aria-label='arrow_back' onClick={this.onPrevElection.bind(this)}>
                            <ArrowBackIcon />
                          </IconButton>
                          <Typography variant='button' gutterBottom>
                            {year}
                          </Typography>
                          {
                            nextElectionYear < currentYear &&
                            <IconButton aria-label='arrow_forward' onClick={this.onNextElection.bind(this)}>
                              <ArrowForwardIcon />
                            </IconButton>
                          }
                          {
                            nextElectionYear >= currentYear &&
                            //  if there is no next button, show a 48x48 empty box to align the above 2 elements
                            <div style={{ width: '48px', height: '48px' }}></div>
                          }
                        </Box>
                        <Typography variant='h4' color='inherit' style={{ display: 'inline-block' }}>

                        </Typography>
                        <Typography variant='h4' color='inherit' style={{ display: 'inline-block' }}>
                          {code}
                        </Typography>
                        <Divider />
                        <List>
                          <ListItemText primary={'區議員'} />
                          <ListItemSecondaryAction></ListItemSecondaryAction>
                        </List>
                        <List>
                          <ListItemText primary={'政黨'} />
                          <ListItemSecondaryAction></ListItemSecondaryAction>
                        </List>
                      </Box>
                    </DistrictCard>
                  </Box>

                  <Box>
                    {district.main_areas.length > 0 && <Grid item xs={12}>
                      <Typography variant='h6' gutterBottom>主要屋邨 / 地區</Typography>
                      <Box
                        display="flex"
                        flexWrap="wrap"
                        alignContent="flex-start"
                      >
                        {
                          district.main_areas.map((area, index) =>
                            <Box mr={1} key={index}>
                              {`${Object.keys(area)[0]}. ${area[Object.keys(area)[0]]}`}
                            </Box>)
                        }
                      </Box>
                    </Grid>}
                    <Grid item xs={12}>
                      <Container maxWidth='lg'>
                        <Typography variant='h5' gutterBottom>估計人口</Typography>
                        {district.expected_population}

                        <Typography variant='h5' gutterBottom>議員候選人</Typography>
                        <Grid item xs={12}>
                          {
                            district.candidates.sort((a, b) => a.candidate_number - b.candidate_number).map(candidate =>
                              <div
                                style={{ width: '100%' }}
                                key={candidate.candidate_number}>
                                <Box
                                  display="flex"
                                  flexDirection="row"
                                  justifyContent='space-between'>
                                  <Box p={1}>
                                    <Avatar
                                      src={`${this.homeUrl}/static/images/avatar/${year}/${code}_${year === 2011 ? '0' : ''}${candidate.candidate_number}.jpg`}
                                      imgProps={{ onError: (e) => { e.target.src = this.homeUrl + '/static/images/avatar/default.png'; } }} >
                                    </Avatar>
                                  </Box>
                                  <Box p={1}>
                                    <Typography gutterBottom variant='h6'>
                                      {`${candidate.candidate_number == null ? "" : candidate.candidate_number + "."} ${candidate.person.name_zh || candidate.person.name_en}`}
                                    </Typography>
                                  </Box>
                                  <Box p={1}>
                                    <Typography color='textSecondary' variant='body2'>
                                      陣營
                      </Typography>
                                    <Typography gutterBottom variant='body1'>
                                      {candidate.political_affiliation ? candidate.political_affiliation.name_zh : ''}
                                    </Typography>
                                  </Box>
                                  <Box p={1}>
                                    <Typography gutterBottom variant='body1'>
                                      {`${candidate.votes} (${candidate.vote_percentage}%)`}
                                    </Typography>
                                  </Box>
                                  <Box p={1}>
                                    <Typography color='textSecondary' variant='body2'>
                                      得票率
                                    </Typography>
                                    <CustomizedProgressBars
                                      value={parseFloat(candidate.vote_percentage)} />
                                  </Box>
                                  <Box p={1}>
                                    {candidate.is_won && <CheckCircleIcon />}
                                    {!candidate.is_won && <div style={{ width: '24px', height: '24px' }}></div>}
                                  </Box>
                                </Box>
                              </div>)
                          }
                        </Grid>
                      </Container>
                    </Grid>
                  </Box>
                </>)
            }}
          </Query>

        </Box>


      </>

    )
  }
}

export default DistrictPage
