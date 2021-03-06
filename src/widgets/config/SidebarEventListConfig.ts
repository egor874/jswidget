import {logError} from '../../common/Error';
import IPlainObject from '../../interfaces/IPlainObject';
import DefaultSettings from './DefaultSettings';
import WidgetConfig from './WidgetConfig';
import FeaturedConfig from './FeaturedConfig';

/**
 * Contains @SidebarEventListConfig widget configuration options
 */
export default class SidebarEventListConfig extends WidgetConfig {

  /**
   * Returns the config if the options are correct
   * @param options {IPlainObject} Widget's options
   */
  static create(options: IPlainObject): SidebarEventListConfig | null {
    if (SidebarEventListConfig.validate(options)) {
      return new SidebarEventListConfig(options);
    } else {
      return null;
    }
  }

  /**
   * Returns true if the options can be used to create the widget's config
   * @param options {IPlainObject} Widget's config
   */
  protected static validate(options: IPlainObject): boolean {
    let valid = true;
    if (!options.eventPageUrl || typeof options.eventPageUrl !== 'string') {
      logError('Attribute [eventPageUrl] is not set correctly');
      valid = false;
    }
    return valid;
  }

  /**
   * A url of the page with an installed 'EventPage' widget on it
   */
  readonly eventPageUrl: string;
  readonly hideIfEmpty: boolean;
  readonly length: number;
  readonly country?: string;
  readonly eventType?: number;
  readonly future: boolean;
  readonly trainerId?: number;
  readonly excludeId?: string;

  /**
   * Pattern for the event page url
   */
  readonly eventPagePattern: string;

  /**
   * A list of 'expand' attributes, sent to API
   */
  readonly expand: string[];

  /**
   * Category ID to filter the events
   */
  readonly categoryId?: number;

  /**
   * Featured config
   */
  readonly featured: FeaturedConfig;

  protected constructor(options: IPlainObject) {
    super(options);
    this.eventPageUrl = options.eventPageUrl;
    this.hideIfEmpty = options.hideIfEmpty !== undefined ? options.hideIfEmpty : false;
    this.length = options.length !== undefined ? options.length : 3;
    this.future = options.future !== undefined ? options.future : true;

    this.country = options.country !== undefined ? options.country : undefined;
    this.eventType = options.eventType !== undefined ? options.eventType : undefined;
    this.trainerId = options.trainerId !== undefined ? options.trainerId : undefined;
    this.excludeId = options.excludeId !== undefined ? options.excludeId : undefined;

    this.categoryId = options.categoryId;

    this.eventPagePattern = options.eventPagePattern !== undefined ?
      options.eventPagePattern :
      DefaultSettings.eventPagePattern;
    if (this.eventPagePattern.includes('{{category}}')) {
      this.expand = ['category'];
    } else {
      this.expand = [];
    }
    this.featured = new FeaturedConfig(options.featured);
  }
}
