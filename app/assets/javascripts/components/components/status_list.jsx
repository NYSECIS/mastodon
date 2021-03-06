import Status from './status';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { ScrollContainer } from 'react-router-scroll';
import StatusContainer from '../containers/status_container';

const StatusList = React.createClass({

  propTypes: {
    statusIds: ImmutablePropTypes.list.isRequired,
    onScrollToBottom: React.PropTypes.func,
    onScrollToTop: React.PropTypes.func,
    onScroll: React.PropTypes.func,
    trackScroll: React.PropTypes.bool
  },

  getDefaultProps () {
    return {
      trackScroll: true
    };
  },

  mixins: [PureRenderMixin],

  handleScroll (e) {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    this._oldScrollPosition = scrollHeight - scrollTop;

    if (scrollTop === scrollHeight - clientHeight) {
      this.props.onScrollToBottom();
    } else if (scrollTop < 100) {
      this.props.onScrollToTop();
    } else {
      this.props.onScroll();
    }
  },

  componentDidUpdate (prevProps) {
    if (prevProps.statusIds.size < this.props.statusIds.size && prevProps.statusIds.first() !== this.props.statusIds.first() && this._oldScrollPosition) {
      const node = ReactDOM.findDOMNode(this);

      if (node.scrollTop > 0) {
        node.scrollTop = node.scrollHeight - this._oldScrollPosition;
      }
    }
  },

  render () {
    const { statusIds, onScrollToBottom, trackScroll } = this.props;

    const scrollableArea = (
      <div className='scrollable' onScroll={this.handleScroll}>
        <div>
          {statusIds.map((statusId) => {
            return <StatusContainer key={statusId} id={statusId} />;
          })}
        </div>
      </div>
    );

    if (trackScroll) {
      return (
        <ScrollContainer scrollKey='status-list'>
          {scrollableArea}
        </ScrollContainer>
      );
    } else {
      return scrollableArea;
    }
  }

});

export default StatusList;
