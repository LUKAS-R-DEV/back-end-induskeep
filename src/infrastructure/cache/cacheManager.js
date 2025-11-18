import NodeCache from 'node-cache';

// Cache com TTL de 5 minutos por padrão
const cache = new NodeCache({
  stdTTL: 300, // 5 minutos
  checkperiod: 60, // Verifica expiração a cada 60 segundos
  useClones: false, // Melhor performance
});

export const cacheManager = {
  /**
   * Obtém um valor do cache
   */
  get(key) {
    return cache.get(key);
  },

  /**
   * Define um valor no cache
   */
  set(key, value, ttl = null) {
    if (ttl) {
      return cache.set(key, value, ttl);
    }
    return cache.set(key, value);
  },

  /**
   * Remove um valor do cache
   */
  del(key) {
    return cache.del(key);
  },

  /**
   * Limpa todo o cache
   */
  flush() {
    return cache.flushAll();
  },

  /**
   * Obtém ou define um valor usando uma função (cache-aside pattern)
   */
  async getOrSet(key, fetchFn, ttl = null) {
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await fetchFn();
    cache.set(key, value, ttl);
    return value;
  },

  /**
   * Invalida cache por padrão (útil para invalidar múltiplas chaves relacionadas)
   */
  invalidatePattern(pattern) {
    const keys = cache.keys();
    const regex = new RegExp(pattern);
    keys.forEach(key => {
      if (regex.test(key)) {
        cache.del(key);
      }
    });
  },
};

export default cacheManager;



