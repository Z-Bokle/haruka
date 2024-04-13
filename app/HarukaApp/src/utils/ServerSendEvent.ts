import EventSource from 'react-native-sse';

export class ServerSentEventHelper {
  private url: URL;
  private eventSource: EventSource;

  constructor(url: string) {
    this.url = new URL(url);
    this.eventSource = new EventSource(this.url);
  }

  public getSource(): EventSource {
    return this.eventSource;
  }
}
