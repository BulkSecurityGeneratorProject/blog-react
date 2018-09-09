import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { byteSize, Translate, ICrudGetAllAction, TextFormat, getSortState, IPaginationBaseState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, reset } from './entry.reducer';
import { IEntry } from 'app/shared/model/entry.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IEntryProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type IEntryState = IPaginationBaseState;

export class Entry extends React.Component<IEntryProps, IEntryState> {
  state: IEntryState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.reset();
  }

  reset = () => {
    this.setState({ activePage: 0 }, () => {
      this.props.reset();
      this.getEntities();
    });
  };

  handleLoadMore = () => {
    if (window.pageYOffset > 0) {
      this.setState({ activePage: this.state.activePage + 1 }, () => this.getEntities());
    }
  };

  sort = prop => () => {
    this.setState(
      {
        activePage: 0,
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.reset()
    );
  };

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { entryList, match } = this.props;
    return (
      <div>
        <h2 id="entry-heading">
          <Translate contentKey="blogApp.entry.home.title">Entries</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />&nbsp;
            <Translate contentKey="blogApp.entry.home.createLabel">Create new Entry</Translate>
          </Link>
        </h2>
        <br />
        <div>
          {entryList.map((entry, i) => (
            <div key={`entity-${i}`}>
              <h2>{entry.title}</h2>
              <div>
                Posted on <TextFormat type="date" value={entry.date} format="MMM D, YYYY, h:mm:ss A" /> by {entry.blog.user.login}
              </div>
              <div dangerouslySetInnerHTML={{ __html: entry.content }} />
              <div className="text-left">
                <div className="btn-group flex-btn-group-container">
                  <Button tag={Link} to={`${match.url}/${entry.id}/edit`} color="primary" size="sm">
                    <FontAwesomeIcon icon="pencil-alt" />{' '}
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.edit">Edit</Translate>
                    </span>
                  </Button>
                  <Button tag={Link} to={`${match.url}/${entry.id}/delete`} color="danger" size="sm">
                    <FontAwesomeIcon icon="trash" />{' '}
                    <span className="d-none d-md-inline">
                      <Translate contentKey="entity.action.delete">Delete</Translate>
                    </span>
                  </Button>
                </div>
              </div>
              <br />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ entry }: IRootState) => ({
  entryList: entry.entities,
  totalItems: entry.totalItems,
  links: entry.links
});

const mapDispatchToProps = {
  getEntities,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Entry);
