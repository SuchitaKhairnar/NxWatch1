import {Component} from 'react'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import {GoPrimitiveDot} from 'react-icons/go'
import {formatDistanceToNow} from 'date-fns'
import {BiLike, BiDislike, BiListPlus} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'
import FailureViewComponent from '../FailureViewComponent'
import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  LoaderOrFailureContainer,
  LoaderComponent,
  NavigationAndTrendingPartContainer,
  TrendingVideoAndDetailsContainer,
  TrendingComponentContainer,
  EachVideoThumbnailImage,
  VideoTitle,
  VideoDetailsOptionsContainers,
  ViewsAndUpdatedTimeContainer,
  HorizontalRule,
  ChannelDetailsContainer,
  ChannelImage,
  PrimitiveDot,
  CustomizeButton,
  ButtonContainer,
  ChannelTitle,
  ChannelSubscriber,
} from './StyledComponents'

const dataFetchStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class VideoItemDetailsRoute extends Component {
  state = {
    dataFetchStatus: dataFetchStatusConstants.initial,
    videoDetails: {},
  }

  componentDidMount = () => {
    this.getVideoData()
  }

  getVideoData = async () => {
    this.setState({dataFetchStatus: dataFetchStatusConstants.loading})
    const {match} = this.props
    const {id} = match.params

    const response = await fetch(`https://apis.ccbp.in/videos/${id}`, {
      method: 'GET',
      headers: {authorization: `Bearer ${Cookies.get('jwt_token')}`},
    })
    if (response.ok) {
      const data = await response.json()

      this.setState({videoDetails: data.video_details})
      this.setState({dataFetchStatus: dataFetchStatusConstants.success})
    }
    if (!response.ok) {
      this.setState({dataFetchStatus: dataFetchStatusConstants.failure})
    }
  }

  renderRoutePartOnDataResponse = lightTheme => {
    const {dataFetchStatus, videoDetails} = this.state

    const {channel} = videoDetails

    switch (dataFetchStatus) {
      case dataFetchStatusConstants.loading:
        return (
          <LoaderOrFailureContainer data-testid="loader" value={lightTheme}>
            <LoaderComponent
              as={Loader}
              type="ThreeDots"
              color="#4f46e5"
              height="50"
              width="50"
            />
          </LoaderOrFailureContainer>
        )
      case dataFetchStatusConstants.failure:
        return (
          <LoaderOrFailureContainer value={lightTheme}>
            <FailureViewComponent retryFunction={this.getVideoData} />
          </LoaderOrFailureContainer>
        )
      case dataFetchStatusConstants.success:
        return (
          <TrendingVideoAndDetailsContainer>
            <EachVideoThumbnailImage
              as={ReactPlayer}
              url={videoDetails.video_url}
              controls
              width="100%"
              height="70vh"
            />

            <VideoTitle value={lightTheme}>{videoDetails.title}</VideoTitle>

            <VideoDetailsOptionsContainers>
              <ViewsAndUpdatedTimeContainer>
                <p>{videoDetails.view_count} Views </p>
                <PrimitiveDot as={GoPrimitiveDot} />
                <p>
                  {formatDistanceToNow(new Date(videoDetails.published_at), {
                    addSuffix: true,
                  })
                    .split(' ')
                    .slice(1)
                    .join(' ')}
                </p>
              </ViewsAndUpdatedTimeContainer>

              <NxtWatchContext.Consumer>
                {value => {
                  const {
                    likedList,
                    dislikedList,
                    savedList,
                    addAsLikedVideos,
                    addAsDislikedVideos,
                    addOrRemoveAsOrFromSavedVideos,
                  } = value

                  const {match} = this.props
                  const {id} = match.params

                  const addToLiked = () => {
                    addAsLikedVideos(id)
                  }

                  const addToDisLiked = () => {
                    addAsDislikedVideos(id)
                  }

                  const toSaveOrUnSave = () => {
                    addOrRemoveAsOrFromSavedVideos(videoDetails)
                  }

                  /*  const likeButtonText = likedList.includes(id)

                  const DislikeButtonText = dislikedList.includes(id) */

                  const savedListIds = savedList.map(each => each.id)

                  const saveButtonText = savedListIds.includes(id)
                    ? 'Saved'
                    : 'Save'

                  return (
                    <ButtonContainer>
                      <CustomizeButton
                        type="button"
                        onClick={addToLiked}
                        value={likedList.includes(id)}
                      >
                        <BiLike /> Like
                      </CustomizeButton>
                      <CustomizeButton
                        type="button"
                        onClick={addToDisLiked}
                        value={dislikedList.includes(id)}
                      >
                        <BiDislike /> Dislike
                      </CustomizeButton>

                      <CustomizeButton
                        type="button"
                        onClick={toSaveOrUnSave}
                        value={savedListIds.includes(id)}
                      >
                        <BiListPlus /> {saveButtonText}
                      </CustomizeButton>
                    </ButtonContainer>
                  )
                }}
              </NxtWatchContext.Consumer>
            </VideoDetailsOptionsContainers>

            <HorizontalRule />
            <ChannelDetailsContainer>
              <ChannelImage
                src={channel.profile_image_url}
                alt="channel logo"
              />
              <div>
                <ChannelTitle value={lightTheme}>{channel.name}</ChannelTitle>
                <ChannelSubscriber>
                  {channel.subscriber_count} subscribers
                </ChannelSubscriber>
                <ChannelSubscriber>
                  {videoDetails.description}
                </ChannelSubscriber>
              </div>
            </ChannelDetailsContainer>
          </TrendingVideoAndDetailsContainer>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <HeaderComponent />
        <NavigationAndTrendingPartContainer>
          <NavigationMenuAsLeftSideBar />
          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value
              return (
                <TrendingComponentContainer
                  data-testid="videoItemDetails"
                  value={lightTheme}
                >
                  {this.renderRoutePartOnDataResponse(lightTheme)}
                </TrendingComponentContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationAndTrendingPartContainer>
      </div>
    )
  }
}

export default VideoItemDetailsRoute
import {Component} from 'react'

import {AiFillHome, AiFillFire} from 'react-icons/ai'
import {SiYoutubegaming} from 'react-icons/si'
import {MdPlaylistAdd} from 'react-icons/md'

import CartContext from '../../context/CartContext'

import {
  SideBarContainer,
  NavItemsContainer,
  ItemText,
  TextItemContainer,
  SideBarBottomContainer,
  BottomText,
  IconsContainer,
  IconImage,
  NavLink,
} from './styledComponents'

class SideBar extends Component {
  renderStatusItems = () => (
    <CartContext.Consumer>
      {value => {
        const {activeTabItem, activeTab, isDarkTheme} = value

        const onClickHomeTabItem = () => {
          activeTabItem('HOME')
        }
        const onClickTrendingTabItem = () => {
          activeTabItem('TRENDING')
        }

        const onClickGamingTabItem = () => {
          activeTabItem('GAMING')
        }

        const onClickSavedVideosTabItem = () => {
          activeTabItem('SAVED VIDEOS')
        }

        const bgColor = isDarkTheme ? '#ffffff' : '#000000'

        const textColor = isDarkTheme ? '#f9f9f9' : '#181818'

        return (
          <SideBarContainer>
            <NavItemsContainer>
              <TextItemContainer
                isActive={activeTab === 'HOME' ? '#f1f5f9' : 'transparent'}
                isActiveColor={bgColor}
                onClick={onClickHomeTabItem}
              >
                <NavLink
                  to="/"
                  color={activeTab === 'HOME' ? '#ff0000' : {bgColor}}
                >
                  <AiFillHome />
                  <ItemText
                    color={activeTab === 'HOME' ? '#ff0000' : {textColor}}
                  >
                    Home
                  </ItemText>
                </NavLink>
              </TextItemContainer>
              <TextItemContainer
                isActive={activeTab === 'TRENDING' ? '#f1f5f9' : 'transparent'}
                onClick={onClickTrendingTabItem}
              >
                <NavLink
                  to="/trending"
                  color={activeTab === 'TRENDING' ? '#ff0000' : {textColor}}
                >
                  <AiFillFire />
                  <ItemText
                    color={activeTab === 'TRENDING' ? '#ff0000' : {bgColor}}
                  >
                    Trending
                  </ItemText>
                </NavLink>
              </TextItemContainer>
              <TextItemContainer
                isActive={activeTab === 'GAMING' ? '#f1f5f9' : 'transparent'}
                onClick={onClickGamingTabItem}
              >
                <NavLink
                  to="/gaming"
                  color={activeTab === 'GAMING' ? '#ff0000' : {textColor}}
                >
                  <SiYoutubegaming />
                  <ItemText
                    color={activeTab === 'GAMING' ? '#ff0000' : {bgColor}}
                  >
                    Gaming
                  </ItemText>
                </NavLink>
              </TextItemContainer>
              <TextItemContainer
                isActive={
                  activeTab === 'SAVED VIDEOS' ? '#f1f5f9' : 'transparent'
                }
                onClick={onClickSavedVideosTabItem}
              >
                <NavLink
                  to="/saved-videos"
                  color={activeTab === 'SAVED VIDEOS' ? '#ff0000' : {textColor}}
                >
                  <MdPlaylistAdd />
                  <ItemText
                    color={activeTab === 'SAVED VIDEOS' ? '#ff0000' : {bgColor}}
                  >
                    Saved videos
                  </ItemText>
                </NavLink>
              </TextItemContainer>
            </NavItemsContainer>
            <SideBarBottomContainer>
              <BottomText color={textColor}>CONTACT US</BottomText>
              <IconsContainer>
                <IconImage
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
                  alt="facebook logo"
                />
                <IconImage
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
                  alt="twitter logo"
                />
                <IconImage
                  src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
                  alt="linked in logo"
                />
              </IconsContainer>
              <ItemText color={textColor}>
                Enjoy! Now to see your channels and recommendations!
              </ItemText>
            </SideBarBottomContainer>
          </SideBarContainer>
        )
      }}
    </CartContext.Consumer>
  )

  render() {
    return <>{this.renderStatusItems()}</>
  }
}

export default SideBar
