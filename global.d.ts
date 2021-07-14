type ItemOf<U> = U extends (infer T)[] ? T : never;
