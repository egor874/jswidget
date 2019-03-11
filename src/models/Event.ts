import IPlainObject from '../interfaces/IPlainObject';
import ScheduleFormatter from '../view/ScheduleFormatter';
import DefaultSettings from '../widgets/config/DefaultSettings';
import Category from './Category';
import EventState from './EventState';
import Form from './form/Form';
import FreeTicketType from './FreeTicketType';
import Language from './Language';
import Location from './Location';
import PaidTicketType from './PaidTicketType';
import RegistrationPage from './RegistrationPage';
import Schedule from './Schedule';
import Tickets from './Tickets';
import Trainer from './Trainer';
import Type from './Type';

export default class Event {
  readonly id: number;
  readonly hashedId: string;
  readonly type: Type;
  readonly title: string;
  readonly language: Language;
  readonly rating: number;
  readonly confirmed: boolean;
  readonly private: boolean;
  readonly free: boolean;
  readonly soldOut: boolean;
  readonly url: string;
  readonly registrationPage: RegistrationPage;
  readonly tickets: Tickets | null;
  readonly trainers: Trainer[];
  readonly description: string;
  readonly schedule: Schedule;
  readonly location: Location;
  readonly registrationForm?: Form;
  readonly state: EventState;

  /**
   * Category of the event
   */
  readonly category?: Category;

  /**
   * @param attrs {object}
   * @param options {object}
   */
  constructor(attrs: IPlainObject, options: any) {
    this.id = attrs.id;
    this.hashedId = attrs.hashed_id;
    this.title = attrs.title;
    this.type = attrs.type ? new Type(attrs.type) : Type.empty();
    this.language = new Language(attrs.spoken_languages, attrs.materials_language);
    this.rating = attrs.rating;
    this.confirmed = attrs.confirmed;
    this.free = attrs.free;
    this.private = attrs.private;
    this.description = attrs.description;
    this.soldOut = attrs.sold_out;
    this.schedule = new Schedule(attrs.schedule);
    this.location = new Location(attrs.location);
    this.category = attrs.category ? new Category(attrs.category) : undefined;
    this.tickets = this.getTickets(this.free, attrs.free_ticket_type, attrs.paid_ticket_types);
    this.url = this.buildUrl(options);
    this.registrationPage = new RegistrationPage(attrs.registration_page,
      options.registrationPageUrl, this.hashedId);
    this.registrationForm = attrs.registration_form ?
      new Form(attrs.instructions, attrs.registration_form, this) :
      undefined;

    this.trainers = this.getTrainers(attrs, options);
    this.state = new EventState(this);
  }

  /**
   * Returns the list of trainer's names
   */
  nameOfTrainers(): string[] {
    return this.trainers.map((trainer) => trainer.fullName());
  }

  protected buildUrl(options: IPlainObject): string {
    const pattern = options.eventPagePattern ? options.eventPagePattern : DefaultSettings.eventPagePattern;
    const categoryName = this.category ? this.category.name : '';
    const dates = this.replaceSpaces(ScheduleFormatter.format('en', this.schedule, 'full_short'));
    const queryParams = pattern.replace('{{id}}', this.hashedId).
      replace('{{title}}', this.replaceSpaces(this.title)).
      replace('{{dates}}', dates).
      replace('{{category}}', this.replaceSpaces(categoryName));
    return encodeURI(`${options.eventPageUrl}?${queryParams}`);
  }

  protected replaceSpaces(value: string): string {
    const regex = /\ /gi;
    return value.replace(regex, '_');
  }

  private getTickets(free: boolean, freeTicketType: any, paidTicketTypes: any[]): Tickets | null {
    if (freeTicketType || paidTicketTypes) {
      return free ?
        new Tickets([], new FreeTicketType(freeTicketType)) :
        new Tickets(paidTicketTypes.map((type) =>
            new PaidTicketType(type, this.schedule.defaultTimezone()),
          ),
        );
    } else {
      return null;
    }
  }

  private getTrainers(attrs: any, options: any): Trainer[] {
    const trainers: any[] = attrs.facilitators;
    if (trainers) {
      return trainers.map((trainer) => new Trainer(trainer, options));
    } else {
      return [];
    }
  }
}
