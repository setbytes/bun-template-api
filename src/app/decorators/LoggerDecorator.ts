export function Logger(target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
  const originalFunction = descriptor.value;
  descriptor.value = function(...args: Array<any>) {
    const bindOriginalFunction = originalFunction.bind(this);
    return logger(args, propertyKey, bindOriginalFunction);
  };
}

function logger(params: Array<any>, functionName: string, originalFunction: Function): any {
  if (params.length) {
    console.info("[INPUT]", functionName, JSON.stringify(params, null, 2));
  }
  try {
    const result = originalFunction(...params);
    Promise.resolve(result).then((data) => {
      console.info("[OUTPUT]", functionName, JSON.stringify(data, null, 2));
    });
    return result;
  } catch (error: any) {
    console.error("[OUTPUT]", functionName, JSON.stringify(error, null, 2));
    throw error;
  }
}
