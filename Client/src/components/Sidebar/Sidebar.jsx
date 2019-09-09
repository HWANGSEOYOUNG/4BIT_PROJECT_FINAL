/*!

=========================================================
* Paper Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import avatar from "assets/img/default-avatar.png";
import logo from "assets/img/react-logo.png";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { MyInfoActions } from '../../Actions/index';

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getCollapseStates(props.routes);
  }
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = routes => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = routes => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }

      if(prop.invisible !== undefined && prop.invisible=== true) {
        return null;
      }

      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        return (
          <li
            className={this.getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={this.state[prop.state]}
              onClick={e => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">{prop.mini}</span>
                  <span className="sidebar-normal">
                    {prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={this.state[prop.state]}>
              <ul className="nav">{this.createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <li className={this.activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink to={prop.layout + prop.path} activeClassName="">
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">{prop.mini}</span>
                <span className="sidebar-normal">{prop.name}</span>
              </>
            )}
          </NavLink>
        </li>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  componentDidMount() {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }

  }
  componentWillUnmount() {
    // we need to destroy the false scrollbar when we navigate
    // to a page that doesn't have this component rendered
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }

  userSidebar(){
    let url =""
    //학생 사이드 바
    if(this.props.auth.role.roleCode === "role_student" ){
            url = ""
           if(this.props.data === null || this.props.data.adminId !== undefined || this.props.data.classTeacherId !== undefined
            ){
             this.props.getStudentProfile(this.props.auth.userId).then(response => {
               return(
                 <>
                 <li>
                   {/* 반게시판 연결 */}
                 <NavLink activeClassName="">
                 <span className="sidebar-mini-icon">CL</span>
                 <span className="sidebar-normal">과정명&nbsp;&brvbar;&nbsp; {this.props.data.classGroup.className}</span>
                </NavLink>
                 </li>
                 <li>
                     {/* 로드맵 연결 */}
                   <NavLink activeClassName="">
                   <span className="sidebar-mini-icon">RO</span>
                   <span className="sidebar-normal">로드맵 단계&nbsp;&brvbar;&nbsp; {this.props.data.roadmapLast}단계</span>
                 </NavLink>
                 </li>
                 <li>
                     {/* 포인트 연결 */}
                   <NavLink activeClassName="">
                   <span className="sidebar-mini-icon">PO</span>
                   <span className="sidebar-normal">포인트&nbsp;&brvbar;&nbsp; {this.props.auth.pointSum}점</span>
                 </NavLink>
                 </li>
                 {/* <li>
                     출석현황 연결
                   <NavLink activeClassName="">
                   <span className="sidebar-mini-icon">CH</span>
                   <span className="sidebar-normal">나의 출석일&nbsp;&brvbar;&nbsp; {this.props.data.attendCount}일 / 125일</span>
                 </NavLink>
                 </li> */}
               </>
               );
            })
          }else {
            return(
              <>
              <li>
                {/* 반게시판 연결 */}
              <NavLink activeClassName="">
              <span className="sidebar-mini-icon">CL</span>
              <span className="sidebar-normal">과정명&nbsp;&brvbar;&nbsp; {this.props.data.classGroup.className}</span>
            </NavLink>
              </li>
              <li>
                  {/* 로드맵 연결 */}
                <NavLink activeClassName="">
                <span className="sidebar-mini-icon">RO</span>
                <span className="sidebar-normal">로드맵 단계&nbsp;&brvbar;&nbsp; {this.props.data.roadmapLast}단계</span>
              </NavLink>
              </li>
              <li>
                  {/* 포인트 연결 */}
                <NavLink activeClassName="">
                <span className="sidebar-mini-icon">PO</span>
                <span className="sidebar-normal">포인트&nbsp;&brvbar;&nbsp; {this.props.auth.pointSum}점</span>
              </NavLink>
              </li>
              {/* <li>
                  출석현황 연결
                <NavLink activeClassName="">
                <span className="sidebar-mini-icon">CH</span>
                <span className="sidebar-normal">나의 출석일&nbsp;&brvbar;&nbsp; {this.props.data.attendCount}일 / 125일</span>
              </NavLink>
              </li> */}
            </>
            );
          }

          //선생님 사이드 바
           }else if(this.props.auth.role.roleCode === "role_teacher"){
                if(this.props.data === null || this.props.data.studentId !== undefined || this.props.data.adminId !== undefined
                  ){
                  this.props.getTeacherProfile(this.props.auth.userId).then(response => {
                     
                    return(
                       <>
                           <li>
                             {/* 반게시판 연결 */}
                           <NavLink activeClassName="">
                           <span className="sidebar-mini-icon">CL</span>
                           <span className="sidebar-normal">담당과정&nbsp;&brvbar;&nbsp; {this.props.data.classGroup.className}</span>
                         </NavLink>
                           </li>
                       </>
                     );
                    

                   })
                  }else{
                    return(
                      <>
                          <li>
                            {/* 반게시판 연결 */}
                          <NavLink activeClassName="">
                          <span className="sidebar-mini-icon">CL</span>
                          <span className="sidebar-normal">담당과정&nbsp;&brvbar;&nbsp; {this.props.data.classGroup.className}</span>
                        </NavLink>
                          </li>
                      </>
                    );
                    
                  }

                  //어드민 사이드바 
                 }else if(this.props.auth.role.roleCode === "role_admin"){

                      if(this.props.data === null || this.props.data.classTeacherId !== undefined || this.props.data.studentId !== undefined
                       ){
                        this.props.getAdminProfile(this.props.auth.userId).then(response => {
                          return(
                            <>
                            <li>
                              <NavLink activeClassName="">
                              <span className="sidebar-mini-icon">BR</span>
                              <span className="sidebar-normal">소속지점&nbsp;&brvbar;&nbsp; {this.props.data.branch.branchName}지점</span>
                            </NavLink>
                              </li>
                    
                            </>
                          );
                        })
                      }else{
                        return(
                          <>
                          <li>
                            <NavLink activeClassName="">
                            <span className="sidebar-mini-icon">BR</span>
                            <span className="sidebar-normal">소속지점&nbsp;&brvbar;&nbsp; {this.props.data.branch.branchName}지점</span>
                          </NavLink>
                            </li>
                  
                          </>
                        );
                      }
                      }

  }
  render() {
    return (
      <div
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <div className="logo">
          <a
            href="https://www.creative-tim.com"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="react-logo" />
            </div>
          </a>
          {/* 메인으로 링크 */}
        
          <a
            href="/dashboard"
            className="simple-text logo-normal"
          >
            4 BIT
          </a>
        </div>

        <div className="sidebar-wrapper" ref="sidebar">
          <div className="user">
            <div className="photo">
              <img src ={avatar} alt="user" />
            </div>
            <div className="info">
              <a
                href="#pablo"
                data-toggle="collapse"
                aria-expanded={this.state.openAvatar}
                onClick={() =>
                  this.setState({ openAvatar: !this.state.openAvatar })
                }
              >
                <span>
                  {this.props.auth.name} 님
                  <b className="caret" />
                </span>
              </a>
              <Collapse isOpen={this.state.openAvatar}>
                <ul className="nav">
                  <li>
                    <NavLink  activeClassName="">
                      <span className="sidebar-mini-icon">No</span>
                      <span className="sidebar-normal">아이디&nbsp;&brvbar;&nbsp; {this.props.auth.username}</span>
                    </NavLink>
                  </li>
                  {
                    this.userSidebar()
                  }
                    {/* <li>
                      <NavLink to="/admin/user-profile" activeClassName="">
                        <span className="sidebar-mini-icon">CL</span>
                        <span className="sidebar-normal">Edit Profile</span>
                      </NavLink>
                    </li>
                  <li>
                    <NavLink to="/admin/user-profile" activeClassName="">
                      <span className="sidebar-mini-icon">S</span>
                      <span className="sidebar-normal">Settings</span>
                    </NavLink>
                  </li> */}
                </ul>
              </Collapse>
            </div>
          </div>
          <Nav>{this.createLinks(this.props.routes)}</Nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth : state.auth.userDetails,
  data : state.myinforeducers.data
});

const mapDispatchToProps = (dispatch) => ({
  getStudentProfile : (userId) => dispatch(MyInfoActions.GetStudentProfile(userId)),
  getTeacherProfile : (userId) => dispatch(MyInfoActions.GetTeacherProfile(userId)),
  getAdminProfile : (userId) => dispatch(MyInfoActions.GetAdminProfile(userId)) 
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));