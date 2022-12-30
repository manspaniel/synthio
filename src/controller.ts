import { Clock } from "./hooks/useClock";

type ControllerOptions = {
  clock: Clock;
};

export class Controller {
  clock: Clock;

  constructor(args: ControllerOptions) {
    this.clock = args.clock;
  }

  render() {}
}
