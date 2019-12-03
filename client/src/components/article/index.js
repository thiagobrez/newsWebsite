import PropTypes from 'prop-types'
import React from 'react'

import styles from './styles.css'

export const ArticleType = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

const Article = ({
  type,
  subject,
  color,
  heroImageURL,
  title,
  authorImageURL,
  authorName,
  children,
}) => (
  <div className={`${styles.article} ${styles[type]}`} style={{ color }}>
    <div className={styles.subject}>
      <span className={styles.subjectText}>{subject}</span>
    </div>
    {heroImageURL && (
      <div className={styles.heroImage}>
        <img src={heroImageURL} className={styles.image} />
        <div className={styles.heroImageOverlay}>
          <div className={styles.readMore}>
            <a href="#" className={styles.readMoreText}>
              Read More
            </a>
          </div>
        </div>
      </div>
    )}
    <div className={styles.title}>
      <span className={styles.titleText}>{title}</span>
    </div>
    <div className={styles.author}>
      <div className={styles.authorImage}>
        <img src={authorImageURL} className={styles.avatar} />
      </div>
      <div className={styles.authorName}>
        <span className={styles.authorNameText}>by {authorName}</span>
      </div>
    </div>
    <div className={styles.content}>
      <p className={styles.contentText}>{children}</p>
    </div>
  </div>
)

Article.propTypes = {
  type: PropTypes.oneOf(Object.values(ArticleType)).isRequired,
  subject: PropTypes.string.isRequired,
  color: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  heroImageURL: PropTypes.string,
  title: PropTypes.string.isRequired,
  authorImageURL: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
}

Article.defaultProps = {
  type: ArticleType.PRIMARY,
  color: '#3E433E',
}

export default Article
