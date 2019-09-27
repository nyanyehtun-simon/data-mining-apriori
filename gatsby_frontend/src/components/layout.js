/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import { Col, Container, Row } from "react-bootstrap"
import { StaticQuery, graphql } from "gatsby"

import Header from "./header"
import Navbar from "./navBar"
import React from "react"

const Layout = ({ children, pageInfo }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <>
        <Container fluid className="px-0 main">
          <Row noGutters className="justify-content-center">
            <Col>
              <Header siteTitle={data.site.siteMetadata.title} />
            </Col>
          </Row>
          {/* <Navbar pageInfo={pageInfo} /> */}
          <Row noGutters>
            <Col>
              <Container className="mt-5">
                <main>{children}</main>
              </Container>
            </Col>
          </Row>
        </Container>
        <Container fluid className="px-0">
          <Row noGutters>
            <Col className="footer-col">
              <footer>
                <span>
                  Written by
                  {` `}
                  <a href="https://github.com/nyanyehtun-simon">Nyan Ye Htun</a>
                  {` & `}
                  
                  <a href="https://github.com/Jojojoseph00">Joseph</a>
                </span>
              </footer>
            </Col>
          </Row>
        </Container>
      </>
    )}
  />
)

export default Layout
