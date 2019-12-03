import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fromJS, Map } from 'immutable'

import Article, { ArticleType } from '../../components/article'
import { GET_ARTICLES, getArticles } from '../../modules/article/actions'

import styles from './styles.css'

const mapStateToProps = ({ loading, article, routing }) => {
  const nextRoute = fromJS(routing).getIn(['locationBeforeTransitions', 'state', 'next'])

  return {
    isLoading: loading.get(GET_ARTICLES.ACTION),
    article,
    nextRoute: nextRoute && nextRoute.toJS(),
  }
}

const mapDispatchToProps = { getArticles }

class Home extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    article: ImmutablePropTypes.map,
    getArticles: PropTypes.func,
  }

  static defaultProps = {
    isLoading: false,
    article: new Map(),
    getArticles: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {}

    props.getArticles()
  }

  render() {
    const { article, isLoading } = this.props

    if (isLoading || !article.size) return null

    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.primary}>
            <Article
              type={ArticleType.PRIMARY}
              subject={article.get(0).subject.name}
              color={article.get(0).subject.color}
              heroImageURL={article.get(0).heroImage}
              title={article.get(0).title}
              authorImageURL={article.get(0).author.picture}
              authorName={article.get(0).author.name}
            >
              <span className={styles.primaryArticleContent}>{article.get(0).text}</span>
            </Article>
          </div>
          <div className={styles.secondary}>
            <Article
              type={ArticleType.SECONDARY}
              subject={article.get(1).subject.name}
              color={article.get(1).subject.color}
              heroImageURL={article.get(1).heroImage}
              title={article.get(1).title}
              authorImageURL={article.get(1).author.picture}
              authorName={article.get(1).author.name}
            >
              {article.get(1).text}
            </Article>
            <Article
              type={ArticleType.SECONDARY}
              subject={article.get(2).subject.name}
              color={article.get(2).subject.color}
              heroImageURL={article.get(2).heroImage}
              title={article.get(2).title}
              authorImageURL={article.get(2).author.picture}
              authorName={article.get(2).author.name}
            >
              {article.get(2).text}
            </Article>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.tertiary}>
            <Article
              type={ArticleType.SECONDARY}
              subject={article.get(3).subject.name}
              color={article.get(3).subject.color}
              title={article.get(3).title}
              authorImageURL={article.get(3).author.picture}
              authorName={article.get(3).author.name}
            >
              {article.get(3).text}
            </Article>
          </div>
          <div className={styles.tertiary}>
            <Article
              type={ArticleType.SECONDARY}
              subject={article.get(4).subject.name}
              color={article.get(4).subject.color}
              title={article.get(4).title}
              authorImageURL={article.get(4).author.picture}
              authorName={article.get(4).author.name}
            >
              {article.get(4).text}
            </Article>
          </div>
          <div className={styles.tertiary}>
            <Article
              type={ArticleType.SECONDARY}
              subject={article.get(5).subject.name}
              color={article.get(5).subject.color}
              title={article.get(5).title}
              authorImageURL={article.get(5).author.picture}
              authorName={article.get(5).author.name}
            >
              {article.get(5).text}
            </Article>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
