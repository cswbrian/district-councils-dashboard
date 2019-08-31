import React from 'react'
import { Route, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ThemeProvider } from 'styled-components/'
import IndexPage from './pages'
import SearchPage from './pages/search'
import ProfilePage from './pages/profile'
import DistrictPage from './pages/district'
import BattleGroundPage from './pages/battleground'
import NotfoundPage from './pages/notfound'
import TestPage from 'pages/test'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import theme, { styledComponentTheme } from 'ui/theme/main'
import './App.css'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import MobileAppBar from './components/organisms/MobileAppBar'
import { makeStyles } from '@material-ui/core/styles'
import drawerReducer from 'reducers/drawer'
import ContextStore, { drawerInitialState } from 'ContextStore'
import withTracker from './WithTracker'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI,
})

const useStyles = makeStyles({
  paper: {
    width: '100%',
  },
})

const ContentContainer = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`

const Root = styled(Box)`
  && {
    display: flex;
    margin: auto;
    overflow: hidden;
  }
`

const App = props => {
  if (!process.env.REACT_APP_GRAPHQL_URI) {
    throw new Error('Graphql host not yet set')
  }

  const [drawerState, drawerDispatch] = React.useReducer(
    drawerReducer,
    drawerInitialState
  )

  const classes = useStyles()

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styledComponentTheme}>
        <MuiThemeProvider theme={theme}>
          <ContextStore.Provider
            value={{
              drawer: {
                state: drawerState,
                dispatch: drawerDispatch,
              },
            }}
          >
            <Root>
              <ContentContainer>
                <CssBaseline />
                <MobileAppBar />
                <main>
                  <Switch>
                    <Route exact path="/" component={withTracker(IndexPage)} />
                    <Route
                      path="/profile/:id"
                      component={withTracker(ProfilePage)}
                    />
                    <Route
                      path="/district/2019/:code"
                      component={withTracker(BattleGroundPage)}
                    />
                    <Route
                      path="/district/:year/:code"
                      component={withTracker(DistrictPage)}
                    />
                    <Route component={withTracker(NotfoundPage)} />
                  </Switch>
                </main>
              </ContentContainer>
              <Drawer
                anchor="left"
                open={drawerState.open}
                variant="persistent"
                classes={{
                  paper: classes.paper,
                }}
              >
                <SearchPage />
              </Drawer>
            </Root>
          </ContextStore.Provider>
        </MuiThemeProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
