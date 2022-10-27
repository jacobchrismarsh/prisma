import { actionOperationMap, Client } from '../../getPrismaClient'

export type Args = ResultArgs & ModelArgs & ClientArgs & QueryOptions

type ResultArgs = {
  result: {
    [ModelName in string]: {
      needs: {
        [VirtPropName in string]: {
          [ModelPropName in string]: boolean
        }
      }
      fields: {
        [VirtPropName in string]: (args: unknown) => unknown
      }
    }
  }
}

type ModelArgs = {
  model: {
    [ModelName in string]: {
      [MethodName in string]: (...args: unknown[]) => unknown
    }
  }
}

type ClientArgs = {
  client: {
    [MethodName in string]: () => unknown
  }
}

type QueryOptionsCbArgs = {
  model: string
  operation: string
  args: { [K in string]: {} | undefined | null | QueryOptionsCbArgs['args'] }
  data: Promise<unknown>
}

type QueryOptionsCbArgsNested = QueryOptionsCbArgs & {
  path: string
}

type QueryOptions = {
  query: {
    [ModelName in string]: {
      [ModelAction in keyof typeof actionOperationMap]: (args: QueryOptionsCbArgs) => unknown
    } & {
      // $nestedOperations?: {
      //   [K in string]: (args: QueryOptionsCbArgsNested) => unknown
      // }
    }
  }
}

/**
 * TODO
 * @param this
 */
export function $extends(this: Client, extension: Args | (() => Args)): Client {
  return Object.create(this, {
    _extensions: {
      get: () => {
        if (typeof extension === 'function') {
          return this._extensions.concat(extension())
        }

        return this._extensions.concat(extension)
      },
    },
  })
}
