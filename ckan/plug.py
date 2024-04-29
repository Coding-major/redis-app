import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
import datetime

from ckanext.eha.views.home import eha_home

def year():
        current_year = datetime.datetime.now().year
        return current_year


class EHAPlugin(plugins.SingletonPlugin):
    plugins.implements(plugins.IBlueprint)
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.ITemplateHelpers)

    # IBlueprint
    def get_blueprint(self):
        blueprint = [eha_home]
        return blueprint

    # IConfigurer

    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_resource('assets', 'eha')

    def get_helpers(self):
        """display the current year"""
        return {'current_year': year}