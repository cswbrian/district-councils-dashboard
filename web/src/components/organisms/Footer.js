import React from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import { UnstyledLink, DefaultLink } from 'components/atoms/Link'
import { Typography } from '@material-ui/core'
import Columns from 'components/atoms/Columns'
import { withRouter } from 'react-router-dom'

const StyledFooter = styled(Box)`
  && {
    width: 100%;
    max-width: 1024px;
    margin: auto;
    padding: 16px;
  }
`

const StyledDivider = styled(Divider)`
  && {
    margin: 16px 0;
  }
`

const StyledFooterLink = styled(UnstyledLink)`
  && {
    color: rgba(0, 0, 0, 0.87);
  }
`

const LinkBox = styled(Box)`
  && {
    margin: 8px 16px 8px 0;
    word-break: keep-all;
    overflow: hidden;
  }
`

function Footer(props) {
  return (
    <>
      <StyledFooter>
        <StyledDivider />
        <Typography variant="body2" gutterBottom>
          本網站所刊載資訊全為公開資料，歸納自
          <DefaultLink href="https://www.eac.hk/">選舉管理委員會</DefaultLink>丶
          <DefaultLink href="https://www.reo.gov.hk/">選舉事務處</DefaultLink>丶
          <DefaultLink href="https://www.censtatd.gov.hk/">
            政府統計處
          </DefaultLink>
          丶
          <DefaultLink href="https://www.districtcouncils.gov.hk">
            各區區議會網站
          </DefaultLink>
          及
          <DefaultLink href="https://github.com/initiummedia/hk_district_council_election">
            端傳媒
          </DefaultLink>
          ，刊載前已盡力確保資料真確性，如有建議或錯漏，請按
          <DefaultLink href="https://forms.gle/irD6tEznWPNda6w59">
            此鏈結
          </DefaultLink>
          回報。
        </Typography>
        <Typography variant="body2">
          本網站與任何2019年區議會選舉候選人或其助選成員無關，刊載資料目的非為促使或阻礙任何候選人在選舉中當選。
        </Typography>
        <StyledDivider />
        <Columns>
          <LinkBox>
            <StyledFooterLink
              target="_blank"
              href="https://www.facebook.com/g0vhk.io"
            >
              g0vhk.io
            </StyledFooterLink>
          </LinkBox>
          <LinkBox>
            <StyledFooterLink
              onClick={
                () => props.history.push(`/disclaimer`)
                // console.log(props)
              }
            >
              關於候選人陣營
            </StyledFooterLink>
          </LinkBox>
          <LinkBox>
            <StyledFooterLink
              target="_blank"
              href="https://forms.gle/irD6tEznWPNda6w59"
            >
              反映意見
            </StyledFooterLink>
          </LinkBox>
          <LinkBox>
            <StyledFooterLink
              target="_blank"
              href="https://github.com/cswbrian/district-councils-dashboard"
            >
              GitHub
            </StyledFooterLink>
          </LinkBox>
          <LinkBox>
            <StyledFooterLink target="_blank" href="https://hkfactcheck.io/">
              選區事實處
            </StyledFooterLink>
          </LinkBox>
          <LinkBox>
            <div
              className="fb-like"
              data-href="https://dc2019.g0vhk.io"
              data-width=""
              data-layout="standard"
              data-action="like"
              data-size="small"
              data-show-faces="true"
              data-share="true"
            ></div>
          </LinkBox>
        </Columns>
      </StyledFooter>
    </>
  )
}

export default withRouter(Footer)
