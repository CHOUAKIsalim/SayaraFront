export interface ModeleDetail {
  CodeModele: { type: string };
  NomModele: { type: string };
  CodeMarque: { type: string };
  versions: [{
    CodeVersion: { type: string };
    CodeModele: { type: string };
    NomVersion: { type: string };
  }];
  options: [{
    CodeOption: { type: string };
    NomOption: { type: string };
    Checked: boolean;
    rel_ver_opt: {
      idRelVerOpt: { type: string };
      CodeVersion: { type: string };
      CodeOption: { type: string };
    };
  }];
  couleurs: [{
    CodeCouleur: { type: string };
    NomCouleur: { type: string};
    CodeHexa: { type: string };
    Checked: boolean;
  }];
}
