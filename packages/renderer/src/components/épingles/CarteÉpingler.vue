<template>
  <v-dialog
    v-model="dialogue"
    :max-width="mdAndUp ? 500 : 300"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('épingler.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="fermer"
          >
          </v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider />
      <v-card-text style="overflow-y: scroll">
        <v-switch
          v-model="épingléSimple"
          color="primary"
          :label="épingléSimple ? t('épingler.épinglé') : t('épingler.épingler')"
        ></v-switch>
        <p>
          <span class="font-weight-bold">{{ t('épingler.optionsAvancées') }}</span>
          <v-btn
            :icon="optionsAvancées ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            size="xsmall"
            variant="flat"
            @click="() => (optionsAvancées = !optionsAvancées)"
          ></v-btn>
        </p>

        <v-expand-transition>
          <div v-show="optionsAvancées">
            <p class="mb-0 text-h6">
              {{ t('épingler.dispositifsÉpingle') }}
            </p>
            <v-radio-group v-model="typeDispositifs">
              <v-radio
                v-for="opt in optionsÉpingle"
                :key="opt.valeur"
                :value="opt.valeur"
              >
                <template #label>
                  <div>
                    <v-list-item :subtitle="opt.sousTitre">
                      <template #title>
                        <v-icon
                          :icon="opt.icône"
                          start
                          size="small"
                        ></v-icon>
                        <span class="font-weight-bold">{{ opt.titre }}</span>
                      </template>
                    </v-list-item>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
            <v-expand-transition>
              <v-autocomplete
                v-show="typeDispositifs === 'SPÉCIFIQUES'"
                v-model="dispositifsSpécifiques"
                :items="dispositifs || []"
                :disabled="!dispositifs"
                :loading="!dispositifs"
                :label="t('épingler.indiceSélectionnerDispositif')"
                density="compact"
                variant="outlined"
                multiple
                chips
                closable-chips
              >
                <template #chip="{props: propsActivateur, item}">
                  <jeton-dispositif
                    v-bind="propsActivateur"
                    :id-dispositif="item.title"
                  />
                </template>

                <template #item="{props: propsActivateur, item}">
                  <item-dispositif
                    v-bind="propsActivateur"
                    :id-dispositif="item.title"
                  />
                </template>
              </v-autocomplete>
            </v-expand-transition>
            <span v-if="optionFichiers">
              <p class="mb-0 text-h6">
                {{ t('épingler.dispositifsÉpingleFichier') }}
              </p>
              <v-radio-group
                v-model="typeDispositifsFichiers"
                :disabled="typeDispositifs === 'AUCUN'"
              >
                <v-radio
                  v-for="opt in optionsÉpingle"
                  :key="opt.valeur"
                  :value="opt.valeur"
                >
                  <template #label>
                    <div>
                      <v-list-item :subtitle="opt.sousTitre">
                        <template #title>
                          <v-icon
                            :icon="opt.icône"
                            start
                            size="small"
                          ></v-icon>
                          <span class="font-weight-bold">{{ opt.titre }}</span>
                        </template>
                      </v-list-item>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <v-expand-transition>
                <v-autocomplete
                  v-show="typeDispositifsFichiers === 'SPÉCIFIQUES'"
                  v-model="dispositifsFichiersSpécifiques"
                  :items="dispositifs"
                  :label="t('épingler.indiceSélectionnerDispositif')"
                  hide-details
                  chips
                  closable-chips
                  density="compact"
                  variant="outlined"
                  multiple
                >
                  <template #chip="{props: propsActivateur, item}">
                    <jeton-dispositif
                      v-bind="propsActivateur"
                      :id-dispositif="item.title"
                    />
                  </template>

                  <template #item="{props: propsActivateur, item}">
                    <item-dispositif
                      v-bind="propsActivateur"
                      :id-dispositif="item.title"
                    />
                  </template>
                </v-autocomplete>
              </v-expand-transition>
            </span>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
          <v-icon
            icon="mdi-close"
            end
          />
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          :loading="enProgrès"
          :disabled="!prêtÀÉpingler || !valeursChangées"
          @click="() => épingler()"
        >
          {{ t('communs.sauvegarder') }}
          <v-icon
            icon="mdi-check"
            end
          />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type favoris} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref, watch} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import {watchEffect} from 'vue';
import ItemDispositif from '/@/components/membres/ItemDispositif.vue';
import JetonDispositif from '/@/components/membres/JetonDispositif.vue';

import {isEqual} from 'lodash-es';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  optionFichiers: {
    type: Boolean,
    default: true,
  },
});

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);
const optionsAvancées = ref(false);

// Options
const typeDispositifs = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>('TOUS');
const typeDispositifsFichiers = ref<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES'>('INSTALLÉ');

const dispositifsSpécifiques = ref<string[]>([]);
const dispositifsFichiersSpécifiques = ref<string[]>([]);

const optionsÉpingle: {
  titre: string;
  sousTitre: string;
  icône: string;
  valeur: 'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES';
}[] = [
  {
    titre: t('épingler.aucun'),
    sousTitre: t('épingler.indiceAucun'),
    icône: 'mdi-cancel',
    valeur: 'AUCUN',
  },
  {
    titre: t('épingler.tous'),
    sousTitre: t('épingler.indiceTous'),
    icône: 'mdi-devices',
    valeur: 'TOUS',
  },
  {
    titre: t('épingler.installé'),
    sousTitre: t('épingler.indiceInstallé'),
    icône: 'mdi-monitor',
    valeur: 'INSTALLÉ',
  },
  {
    titre: t('épingler.dispositifsSpécifiques'),
    sousTitre: t('épingler.indiceDispositifsSpécifiques'),
    icône: 'mdi-monitor-cellphone-star',
    valeur: 'SPÉCIFIQUES',
  },
];

// Dispositifs
const dispositifs = suivre(constl.suivreDispositifs);

// Statut favoris
const statutFavoris = suivre(constl.favoris.suivreÉtatFavori, {idObjet: props.id});

watch(statutFavoris, () => {
  if (statutFavoris.value) {
    if (
      typeof statutFavoris.value.base === 'string' &&
      ['TOUS', 'INSTALLÉ', 'AUCUN'].includes(statutFavoris.value.base)
    ) {
      typeDispositifs.value = statutFavoris.value.base as 'TOUS' | 'AUCUN' | 'INSTALLÉ';
    } else {
      typeDispositifs.value = 'SPÉCIFIQUES';
      dispositifsSpécifiques.value =
        typeof statutFavoris.value.base === 'string'
          ? [statutFavoris.value.base]
          : statutFavoris.value.base;
    }
  } else {
    typeDispositifs.value = 'AUCUN';
    // On laisse typeDispositifsFichiers avec "INSTALLÉ" par défaut
    typeDispositifsFichiers.value = 'INSTALLÉ';
    dispositifsSpécifiques.value = [];
    dispositifsFichiersSpécifiques.value = [];
  }
});

// Contrôles simples
const épingléSimple = ref(typeDispositifs.value !== 'AUCUN');
watchEffect(() => {
  if (épingléSimple.value) {
    typeDispositifs.value = 'TOUS';
    typeDispositifsFichiers.value = 'INSTALLÉ';
  } else {
    typeDispositifs.value = 'AUCUN';
    typeDispositifsFichiers.value = 'AUCUN';
  }
});

// Contrôles avancés
const dispositifsSélectionnés = computed<favoris.typeDispositifs | undefined>(() => {
  if (typeDispositifs.value === 'AUCUN') return undefined;
  return typeDispositifs.value === 'SPÉCIFIQUES'
    ? dispositifsSpécifiques.value
    : typeDispositifs.value;
});
const dispositifsFichiers = computed<favoris.typeDispositifs | undefined>(() => {
  if (typeDispositifsFichiers.value === 'AUCUN') return undefined;
  return typeDispositifsFichiers.value === 'SPÉCIFIQUES'
    ? dispositifsFichiersSpécifiques.value
    : typeDispositifsFichiers.value;
});

const ilYEuChangement = computed<boolean>(() => {
  if (statutFavoris.value) {
    return dispositifsSélectionnés.value !== statutFavoris.value.base;
  } else {
    return typeDispositifs.value !== 'AUCUN';
  }
});

const prêtÀÉpingler = computed<boolean>(() => {
  const dispositifsPrêts =
    typeDispositifs.value === 'SPÉCIFIQUES' ? !!dispositifsSpécifiques.value.length : true;
  const dispositifsFichiersPrêts =
    typeDispositifsFichiers.value === 'SPÉCIFIQUES'
      ? !!dispositifsFichiersSpécifiques.value.length
      : true;
  return dispositifsPrêts && dispositifsFichiersPrêts && ilYEuChangement.value;
});

const valeursChangées = computed<boolean>(() => {
  if (!statutFavoris.value) return true;
  const {base} = statutFavoris.value;
  const dispositifsChangés = Array.isArray(base)
    ? isEqual(new Set(base), new Set(dispositifsSpécifiques.value))
    : base !== typeDispositifs.value;

  return dispositifsChangés;
});

// Sauvegarder
const enProgrès = ref(false);
const épingler = async () => {
  enProgrès.value = true;

  if (dispositifsSélectionnés.value) {
    const épingle: {
      idObjet: string;
      dispositifs: favoris.typeDispositifs;
      dispositifsFichiers?: favoris.typeDispositifs;
      récursif: boolean;
    } = {
      idObjet: props.id,
      dispositifs: dispositifsSélectionnés.value,
      récursif: true,
    };
    if (dispositifsFichiers.value) épingle.dispositifsFichiers = dispositifsFichiers.value;
  } else {
    await désépingler();
  }
  fermer();
};
const désépingler = async () => {
  await constl.favoris.désépinglerFavori({idObjet: props.id});
};

// Fermer
const fermer = () => {
  dialogue.value = false;
  enProgrès.value = false;
};
</script>
