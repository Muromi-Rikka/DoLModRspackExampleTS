import { get, isFunction, isObject, isString } from "lodash-es";
// import type {SC2DataManager} from "../../../dist-BeforeSC2/SC2DataManager";
// import type {ModUtils} from "../../../dist-BeforeSC2/Utils";
/**
 * Returns a value with a suffix appended, used for mod framework key generation.
 *
 * @param key {string}
 */
// eslint-disable-next-line unicorn/no-global-object-property-assignment
globalThis.aaaaabbbbbccccc = (key: string): string => {
  console.log("aaaaabbbbbccccc", key); // eslint-disable-line no-console
  return `${key}_aaaaabbbbbccccc`;
};

export interface JqEventListenerObject {
  data: any | undefined;
  guid: number;

  handler: Function;
  namespace: string;
  needsContext: any | undefined;
  origType: string;
  selector: any | undefined;
  type: string;
}

export type JqEventListenersDataType = Record<string, JqEventListenerObject[]>;
export interface LinkTypeData {
  count: number;
  external: boolean;
  isLink: boolean;
  link: string;
  setFn: any | undefined;
  text: string;
}

export function getEventListenersFromJqNode(node: ReturnType<typeof $>): JqEventListenersDataType {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  return $._data(node[0], "events");
}

export function isLinkTypeData(o: any): o is LinkTypeData {
  return isObject(o) && isString(get(o, "link")) && isString(get(o, "text"));
}

const logger = globalThis.modUtils.getLogger();

export function ModuleWebpackExampleTs_patchLinkButton(
  MacroReference: typeof Macro,
  ScriptingReference: typeof Scripting,
) {
  const link = MacroReference.get("link");

  if (!link) {
    console.error("patchLinkButton() cannot find macro [icon]");
    logger.error(`patchLinkButton() cannot find macro [icon]`);
    return;
  }

  const h: Function = link.OriginHandlerPassageQBalance;
  if (!h && !isFunction(h)) {
    console.error("patchLinkButton() cannot find macro [icon] handle", [link, h]);
    logger.error(`patchLinkButton() cannot find macro [icon] handle`);
    return;
  }

  MacroReference.delete("button");
  MacroReference.delete("link");
  MacroReference.add(["button", "link"], {
    /* eslint-disable unicorn/no-this-outside-of-class, unicorn/no-this-assignment, no-console */
    handler() {
      const thisPtr = this;
      console.log("patchLinkButton handler", [thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);

      // eslint-disable-next-line prefer-rest-params
      const r = h.apply(this as any, arguments);

      const isNeedHook = (
        (
          typeof thisPtr.args[0] === "object"
          && typeof thisPtr.args[1] === "object"
        )
        || typeof thisPtr.args[2] === "object"
      );

      if (isNeedHook) {
        const hookData = thisPtr.args[2] || thisPtr.args[1];
        if (!isLinkTypeData(hookData)) {
          console.error("patchLinkButton() hookData invalid", [thisPtr, thisPtr.name, thisPtr.args, hookData]);
          return r;
        }

        const outputReference = $(this.output);

        const children = outputReference.children();
        const node = children.last();

        const events = getEventListenersFromJqNode(node);

        const hookKeyList = ["keypress", "click"];

        for (const key of hookKeyList) {
          const eventList = events[key];
          if (eventList) {
            for (const event of eventList) {
              const handler = event.handler;
              event.handler = function () {
                console.log("patchLinkButton output jq events", [key, thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);
                const testR = ScriptingReference.evalTwineScript(hookData.text.trim());
                if (testR) {
                  // need filter
                  console.log("patchLinkButton filter event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                  if (hookData.text.trim() !== hookData.link.trim()) {
                    console.log("patchLinkButton run custom event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                    ScriptingReference.evalTwineScript(hookData.link.trim());
                  }
                }
                else {
                  // allow
                  console.log("patchLinkButton allow event", [key, thisPtr, thisPtr.name, thisPtr.args]);
                  // eslint-disable-next-line prefer-rest-params
                  Reflect.apply(handler, this, arguments);
                }
              };
            }
          }
        }

        // const clickH = events['click']?.[0]?.handler;
        // if (clickH) {
        //     console.log('patchLinkButton handler events', [events, events['click'], clickH.toString()]);
        //     events['click'][0].handler = function () {
        //         console.log('patchLinkButton output jq events click', [thisPtr, thisPtr.name, thisPtr.args, thisPtr.args[0], thisPtr.output]);
        //         // clickH.apply(this, arguments);
        //     }
        // }
      }

      return r;
    },
    /* eslint-enable unicorn/no-this-outside-of-class, unicorn/no-this-assignment, no-console */
    isAsync: true,

    tags: null,
  });

  console.log("patchLinkButton() success"); // eslint-disable-line no-console
  logger.log("patchLinkButton() success");
}
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line unicorn/no-global-object-property-assignment
globalThis.ModuleWebpackExampleTs_patchLinkButton = ModuleWebpackExampleTs_patchLinkButton;
