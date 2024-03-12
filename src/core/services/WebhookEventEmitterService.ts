export class WebhookEventEmitterService {
  private readonly queue: Array<any> = [];
  private isRunningQueue: boolean = false;

  public constructor() {
    this.queue = [];
  }

  public async handleEventEmitter(eventData: any): Promise<any> {
    console.log("integration customer", eventData);
  }

  public add(eventData: any): void {
    this.queue.push(eventData);
    if (!this.isRunningQueue) {
      this.runner();
    }
  }

  public async runner(): Promise<void> {
    this.isRunningQueue = true;
    console.warn("start emitter");
    while (this.queue.length) {
      const eventData = this.queue.shift();
      try {
        console.log(eventData);
      } catch (error) {
        console.log(error);
      }
    }
    this.isRunningQueue = false;
    console.warn("end emitter");
  }
}
