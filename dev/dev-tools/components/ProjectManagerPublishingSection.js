import styled, { css } from 'react-emotion';

import * as React from 'react';
import * as Constants from 'app/common/constants';
import * as Strings from 'app/common/strings';
import * as SVG from 'app/common/svg';

import InputWithLabel from 'app/components/InputWithLabel';
import TextareaWithLabel from 'app/components/TextareaWithLabel';

const STYLES_HEADING_WITH_DISMISS = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADING_WITH_DISMISS_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADING_WITH_DISMISS_RIGHT = css`
  flex-shrink: 0;
  cursor: pointer;
`;

const STYLES_PUBLISHING_SECTION = css`
  font-family: ${Constants.fontFamilies.regular};
  background: ${Constants.colors.black};
  color: ${Constants.colors.border};
  height: 100%;
  overflow-y: scroll;
  width: 100%;
  padding: 16px 16px 48px 16px;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${Constants.colors.foregroundAccent};
  }
`;

const STYLES_HEADING = css`
  font-family: ${Constants.fontFamilies.demi};
  border-bottom: ${Constants.colors.foregroundAccent} 1px solid;
  overflow-wrap: break-word;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  padding-bottom: 16px;
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  font-family: ${Constants.fontFamilies.regular};
  overflow-wrap: break-word;
  font-size: 14px;
  line-height: 1.5;
  width: 100%;
  max-width: 640px;
`;

const STYLES_SMALL_PARAGRAPH = css`
  font-family: ${Constants.fontFamilies.regular};
  font-size: 12px;
  line-height: 1.5;
  width: 100%;
  max-width: 640px;
`;

const STYLES_LARGE_BUTTON = css`
  font-family: ${Constants.fontFamilies.demi};
  color: ${Constants.colors.white};
  background: ${Constants.colors.primary};
  border-radius: 4px;
  padding: 12px 16px 10px 16px;
  font-size: 16px;
  line-height: 1;
  transtion: 200ms ease all;
  cursor: pointer;

  :hover {
    background: ${Constants.colors.primaryAccent};
  }
`;

const STYLES_EMPHASIS = css`
  color: ${Constants.colors.green};
`;

const STYLES_ACTIONS = css`
  margin-top: 48px;
`;

// TODO(jim): Controls for privacy.
export default class ProjectManagerPublishingSection extends React.Component {
  state = {
    isPublishing: false,
    config: getConfigFromProps(this.props),
    errors: {},
  };

  _handleChangeName = e => {
    const value = e.target.value;
    this.setState(state => {
      const oldSlug = Strings.slugify(state.config.name);
      let slug = state.config.slug;
      if (state.config.slug === oldSlug) {
        slug = Strings.slugify(value);
      }
      return {
        config: {
          ...state.config,
          name: value,
          slug,
        },
        errors: {
          ...state.errors,
          name: Strings.isEmptyOrNull(value) ? 'Must be not blank' : null,
          slug: Strings.isEmptyOrNull(slug) ? 'Must be not blank' : null,
        },
      };
    });
  };

  _handleChangeSlug = e => {
    const value = e.target.value;
    this.setState(state => {
      let slug = Strings.slugify(value);
      return {
        config: {
          ...state.config,
          slug,
        },
        errors: {
          ...state.errors,
          slug: Strings.isEmptyOrNull(slug) ? 'Must be not blank' : null,
        },
      };
    });
  };

  _handleChangeGithubUrl = e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        config: {
          ...state.config,
          githubUrl: value,
        },
        errors: {
          ...state.errors,
          githubUrl:
            !Strings.isEmptyOrNull(value) && !value.match(/^https:\/\/github.com\//)
              ? 'Must be in format "https://github.com/"'
              : null,
        },
      };
    });
  };

  _handleChangeDescription = e => {
    const value = e.target.value;
    this.setState(state => {
      return {
        config: {
          ...state.config,
          description: value,
        },
      };
    });
  };

  _handleDismissPublishView = () => {
    this.setState((state, props) => ({
      config: getConfigFromProps(props),
    }));
    this.props.onUpdateState({
      isPublishing: false,
    });
  };

  _handlePublish = async () => {
    this.setState({
      isPublishing: true,
    });
    await this.props.onPublish({
      config: this.state.config,
    });
  };

  hasErrors() {
    return Object.keys(this.state.errors).some(key => this.state.errors[key]);
  }

  renderActions() {
    let publishButton;
    // TODO(freiksenet): Add styling to different button states
    if (this.state.isPublishing) {
      publishButton = (
        <span role="button" className={STYLES_LARGE_BUTTON}>
          Publishing...
        </span>
      );
    } else if (this.hasErrors()) {
      publishButton = (
        <span role="button" className={STYLES_LARGE_BUTTON}>
          Fix errors
        </span>
      );
    } else {
      publishButton = (
        <span role="button" className={STYLES_LARGE_BUTTON} onClick={this._handlePublish}>
          Publish {this.state.config.slug}
        </span>
      );
    }
    return <div className={STYLES_ACTIONS}>{publishButton}</div>;
  }

  render() {
    return (
      <div className={STYLES_PUBLISHING_SECTION}>
        <h2 className={`${STYLES_HEADING} ${STYLES_HEADING_WITH_DISMISS}`}>
          <span className={STYLES_HEADING_WITH_DISMISS_LEFT}>
            Publish your project to the internet
          </span>
          <SVG.Dismiss
            className={STYLES_HEADING_WITH_DISMISS_RIGHT}
            onClick={this._handleDismissPublishView}
            size="24px"
          />
        </h2>

        <p className={STYLES_PARAGRAPH}>
          By publishing your project, users with an Android phone will be able to access your
          project from our website. Users will also be able to leave comments on your project page.
        </p>

        <InputWithLabel
          style={{ margin: '24px 0 24px 0' }}
          label="Name"
          name="name"
          value={this.state.config.name}
          errorValue={this.state.errors.name}
          onChange={this._handleChangeName}
        />

        <InputWithLabel
          style={{ margin: '0 0 24px 0' }}
          label="URL slug"
          name="slug"
          value={this.state.config.slug}
          errorValue={this.state.errors.slug}
          onChange={this._handleChangeSlug}
        />

        <InputWithLabel
          style={{ margin: '0 0 24px 0' }}
          label="Github Source URL (optional)"
          name="githubUrl"
          value={this.state.config.githubUrl}
          errorValue={this.state.errors.githubUrl}
          onChange={this._handleChangeGithubUrl}
        />

        <TextareaWithLabel
          style={{ margin: '0 0 24px 0' }}
          label="Description (optional)"
          name="description"
          minRows={3}
          value={this.state.config.description}
          errorValue={this.state.errors.description}
          onChange={this._handleChangeDescription}
        />

        <h2 className={STYLES_HEADING}>Confirm changes</h2>
        <p className={STYLES_PARAGRAPH}>
          Once you publish your project, you will be able to view it at&nbsp;
          <span className={STYLES_EMPHASIS}>
            https://expo.io/@username/{this.state.config.slug}
          </span>.
        </p>
        {this.renderActions()}
      </div>
    );
  }
}

function getConfigFromProps(props) {
  return {
    name: props.config.name || '',
    slug: props.config.slug || '',
    githubUrl: props.config.githubUrl || '',
    description: props.config.description || '',
  };
}
